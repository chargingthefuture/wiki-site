"use client";

import type { ChymeRoomState } from "@ctf/shared";
import { deleteChymeProfile, deleteFullAccount, getChymeRoom, joinChymeCall } from "@ctf/shared";
import { useEffect, useState } from "react";
import { getStreamWebClient } from "../../lib/streamWebClient";

interface SocialAudioWorkspaceProps {
  streamChatMauLimit: number;
  observabilityProvider: string;
}

export function SocialAudioWorkspace(props: SocialAudioWorkspaceProps) {
  const [roomState, setRoomState] = useState<ChymeRoomState | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinStatus, setJoinStatus] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    const loadRoom = async () => {
      try {
        const room = await getChymeRoom();
        if (mounted) {
          setRoomState(room);
        }
      } catch (error) {
        if (mounted) {
          setJoinStatus("Unable to load room state.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadRoom();

    return () => {
      mounted = false;
    };
  }, []);

  const onJoinCall = async () => {
    try {
      const streamClient = getStreamWebClient();
      if (!streamClient) {
        setJoinStatus("Stream is not configured yet.");
        return;
      }

      const response = await joinChymeCall();
      if (!response.ok || !response.streamToken || !response.streamUserId || !response.streamApiKey) {
        setJoinStatus("Unable to join call at the moment.");
        return;
      }

      if (streamClient.userID && streamClient.userID !== response.streamUserId) {
        await streamClient.disconnectUser();
      }

      if (!streamClient.userID) {
        await streamClient.connectUser(
          {
            id: response.streamUserId,
            name: response.streamUserName ?? "Member",
          },
          response.streamToken,
        );
      }

      const channelId = response.streamChannelId ?? response.roomId;
      const channelType = response.streamCallType ?? "messaging";
      const channel = streamClient.channel(channelType, channelId);
      await channel.watch();

      setJoinStatus("Connected to Chyme voice room.");
    } catch {
      setJoinStatus("Unable to join call at the moment.");
    }
  };

  const onDeleteChymeProfile = async () => {
    const confirmed = window.confirm("Delete Chyme service data only? Your account will remain active.");
    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteChymeProfile();
      if (response.ok) {
        setJoinStatus("Chyme service data deletion requested.");
      }
    } catch {
      setJoinStatus("Unable to request Chyme data deletion.");
    }
  };

  const onDeleteFullAccount = async () => {
    const confirmed = window.confirm("Delete full account and all service data? This is permanent.");
    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteFullAccount();
      if (response.ok) {
        setJoinStatus("Full account deletion requested.");
      }
    } catch {
      setJoinStatus("Unable to request full account deletion.");
    }
  };

  const participants = roomState?.participants ?? [];

  return (
    <div className="workspace">
      <header className="workspace-header">
        <div>
          <p className="workspace-service-tag">Mini-App: Chyme</p>
          <h2>Chyme Social Audio Room</h2>
          <p className="workspace-subtitle">Simple clubhouse-style audio with low distraction.</p>
        </div>
        <button type="button" className="join-call-button" onClick={onJoinCall}>
          Join Call
        </button>
      </header>

      {joinStatus ? <p className="workspace-status">{joinStatus}</p> : null}

      <section className="speaker-grid" aria-label="Current room participants">
        {loading ? <p>Loading Chyme room...</p> : null}
        {!loading && participants.length === 0 ? <p>No participants yet.</p> : null}
        {participants.map((speaker) => (
          <article key={speaker.id} className="speaker-card">
            <div className="speaker-avatar" aria-hidden="true">
              {speaker.displayName.slice(0, 1)}
            </div>
            <h3>{speaker.displayName}</h3>
            <p>{speaker.role === "speaker" ? "Speaking" : "Listening"}</p>
          </article>
        ))}
      </section>

      <footer className="workspace-footer">
        <p>Stream Chat MAU budget: {props.streamChatMauLimit}</p>
        <p>Observability: {props.observabilityProvider}</p>
        <div className="workspace-actions">
          <button type="button" className="danger-secondary" onClick={onDeleteChymeProfile}>
            Delete Chyme Data
          </button>
          <button type="button" className="danger-primary" onClick={onDeleteFullAccount}>
            Delete Full Account
          </button>
        </div>
      </footer>
    </div>
  );
}
