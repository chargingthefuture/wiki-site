/* eslint-disable */
'use client';

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import {
  Mic, MicOff, Phone, Hand, Users, Search, Plus, Bell,
  Settings, ChevronRight, Radio, Lock, Globe, Star,
  MessageSquare, Send, Hash, Volume2, VolumeX, X, Heart,
} from "lucide-react";

interface Room {
  id: string | number;
  live: boolean;
  title: string;
  hosts: string[];
  speakers: number;
  scheduled: string;
  tags: string[];
  listeners: number;
}

interface ActiveSpeaker {
  name: string;
  color: string;
  speaking: boolean;
  initials: string;
  muted: boolean;
  role: string;
}

interface AudienceMember {
  name: string;
  initials: string;
}

interface ChatMessage {
  id: string | number;
  user: string;
  text: string;
  time: string;
}

// Empty state - no seed data. Single user with no rooms created yet.
const ROOMS: Room[] = [];
const ACTIVE_SPEAKERS: ActiveSpeaker[] = [];
const AUDIENCE: AudienceMember[] = [];
const CHAT_MSGS: ChatMessage[] = [];

interface ChymeAppProps {
  onClose: () => void;
}

export function ChymeApp({ onClose }: ChymeAppProps) {
  const { isAuthenticated, signIn } = useAuth();
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [muted, setMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMsgs, setChatMsgs] = useState<ChatMessage[]>(CHAT_MSGS);
  const [showChat, setShowChat] = useState(false);
  const [tab, setTab] = useState<"rooms" | "upcoming">("rooms");

  const PRIMARY = "#22C55E";
  const DARK_BG = "#021006";
  const CARD_BG = "#041a0b";
  const BORDER = "#052e16";

  const handleStartRoom = async () => {
    if (!isAuthenticated) {
      await signIn();
      return;
    }
    // TODO: Implement room creation flow
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMsgs((m) => [...m, { id: Date.now(), user: "You", text: chatInput, time: "Now" }]);
    setChatInput("");
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: DARK_BG, fontFamily: "'Inter', system-ui, sans-serif", color: "#E8EAF0", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <header style={{ height: 60, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, background: "#030d05", flexShrink: 0 }}>
        <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(34,197,94,0.1)", border: `1px solid ${PRIMARY}30`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: PRIMARY }}>
          <X size={16} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${PRIMARY}25`, border: `1px solid ${PRIMARY}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Radio size={18} style={{ color: PRIMARY }} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#F0FDF4" }}>Chyme 🎙️</div>
            <div style={{ fontSize: 12, color: "#16A34A" }}>Social audio for survivors</div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <Badge style={{ background: `${PRIMARY}15`, color: PRIMARY, border: `1px solid ${PRIMARY}30`, fontSize: 11, padding: "4px 12px", borderRadius: 20 }}>
            🔴 {ROOMS.filter((r) => r.live).length} Live
          </Badge>
          <Badge style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)", fontSize: 11, padding: "4px 12px", borderRadius: 20 }}>
            {ROOMS.reduce((s, r) => s + r.listeners, 0)} Listening
          </Badge>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B7280" }}>
          <Search size={16} />
        </button>
        <button style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B7280" }}>
          <Bell size={16} />
        </button>
      </header>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <aside style={{ width: 300, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0, background: "#030d05" }}>
          {/* Create room CTA */}
          <div style={{ padding: "16px 16px 12px" }}>
            <button 
              onClick={handleStartRoom}
              disabled={isAuthenticated === false}
              title={isAuthenticated === false ? "Sign in to start a room" : ""}
              style={{ 
                width: "100%", 
                padding: "12px 16px", 
                borderRadius: 12, 
                background: isAuthenticated ? `linear-gradient(135deg, ${PRIMARY} 0%, #16A34A 100%)` : "rgba(255,255,255,0.1)", 
                border: "none", 
                color: isAuthenticated ? "#fff" : "#9CA3AF",
                fontSize: 14, 
                fontWeight: 700, 
                cursor: isAuthenticated ? "pointer" : "not-allowed",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: 8,
                opacity: isAuthenticated ? 1 : 0.6
              }}>
              <Plus size={16} /> {isAuthenticated ? "Start a Room" : "Sign in to Start"}
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, padding: "0 16px 12px" }}>
            {(["rooms", "upcoming"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "7px 0", borderRadius: 8, background: tab === t ? `${PRIMARY}18` : "transparent", border: tab === t ? `1px solid ${PRIMARY}35` : "1px solid transparent", color: tab === t ? PRIMARY : "#6B7280", fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: "pointer", textTransform: "capitalize" }}>
                {t === "rooms" ? "Live Rooms" : "Upcoming"}
              </button>
            ))}
          </div>

          <ScrollArea style={{ flex: 1, padding: "0 12px 16px" }}>
            {ROOMS.filter((r) => tab === "rooms" ? r.live : !r.live).map((room) => (
              <div key={room.id} onClick={() => setActiveRoom(room)} style={{ padding: "14px", borderRadius: 12, background: activeRoom?.id === room.id ? `${PRIMARY}14` : "rgba(255,255,255,0.02)", border: `1px solid ${activeRoom?.id === room.id ? PRIMARY + "40" : BORDER}`, marginBottom: 8, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  {room.live && <div style={{ width: 8, height: 8, borderRadius: "50%", background: PRIMARY, flexShrink: 0, marginTop: 6, boxShadow: `0 0 6px ${PRIMARY}` }} />}
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#F0FDF4", lineHeight: 1.4, flex: 1 }}>{room.title}</div>
                </div>
                <div style={{ fontSize: 12, color: "#16A34A", marginBottom: 6 }}>
                  {room.hosts.join(", ")} · {room.live ? `${room.speakers} speakers` : room.scheduled}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {room.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: 10, color: PRIMARY, background: `${PRIMARY}15`, padding: "2px 8px", borderRadius: 20, border: `1px solid ${PRIMARY}25` }}>#{tag}</span>
                    ))}
                  </div>
                  {room.live && (
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, color: "#4B5563", fontSize: 12 }}>
                      <Users size={12} />
                      {room.listeners}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </aside>

        {/* Main room view */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {activeRoom ? (
            <>
              {/* Room header */}
              <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      {activeRoom.live && <div style={{ width: 8, height: 8, borderRadius: "50%", background: PRIMARY, boxShadow: `0 0 8px ${PRIMARY}` }} />}
                      <Badge style={{ background: `${PRIMARY}15`, color: PRIMARY, border: `1px solid ${PRIMARY}30`, fontSize: 11, padding: "2px 10px", borderRadius: 20 }}>
                        {activeRoom.live ? "🔴 Live" : "📅 Upcoming"}
                      </Badge>
                      <span style={{ fontSize: 12, color: "#4B5563" }}>Survivor space</span>
                      <Lock size={12} style={{ color: "#4B5563" }} />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#F0FDF4", lineHeight: 1.3, marginBottom: 4 }}>{activeRoom.title}</div>
                    <div style={{ fontSize: 13, color: "#16A34A" }}>Hosted by {activeRoom.hosts.join(" & ")} · {activeRoom.listeners} listening</div>
                  </div>
                  <button onClick={() => setShowChat(!showChat)} style={{ padding: "8px 14px", borderRadius: 10, background: showChat ? `${PRIMARY}20` : "rgba(255,255,255,0.04)", border: `1px solid ${showChat ? PRIMARY + "40" : "rgba(255,255,255,0.08)"}`, color: showChat ? PRIMARY : "#9CA3AF", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <MessageSquare size={14} /> Chat
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Stage */}
                <ScrollArea style={{ flex: 1, padding: "20px 24px" }}>
                  {/* Speakers */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#4B5563", textTransform: "uppercase", marginBottom: 16 }}>On Stage · {ACTIVE_SPEAKERS.length} Speakers</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                      {ACTIVE_SPEAKERS.map((sp) => (
                        <div key={sp.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 100 }}>
                          <div style={{ position: "relative" }}>
                            <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${sp.color}20`, border: `3px solid ${sp.speaking ? sp.color : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: sp.speaking ? `0 0 20px ${sp.color}50` : "none", transition: "all 0.3s" }}>
                              <span style={{ fontSize: 20, fontWeight: 800, color: sp.color }}>{sp.initials}</span>
                            </div>
                            <div style={{ position: "absolute", bottom: 2, right: 2, width: 22, height: 22, borderRadius: "50%", background: sp.muted ? "#4B5563" : PRIMARY, border: "2px solid #021006", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {sp.muted ? <MicOff size={10} style={{ color: "#fff" }} /> : <Mic size={10} style={{ color: "#fff" }} />}
                            </div>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#E8EAF0", textAlign: "center" }}>{sp.name}</div>
                          <Badge style={{ fontSize: 10, background: sp.role === "Host" ? `${PRIMARY}20` : "rgba(255,255,255,0.05)", color: sp.role === "Host" ? PRIMARY : "#6B7280", border: `1px solid ${sp.role === "Host" ? PRIMARY + "35" : "transparent"}`, padding: "1px 8px", borderRadius: 20 }}>
                            {sp.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audience */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#4B5563", textTransform: "uppercase", marginBottom: 16 }}>
                      Audience · {activeRoom.listeners} Listening
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                      {AUDIENCE.map((a) => (
                        <div key={a.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 64 }}>
                          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF" }}>{a.initials}</span>
                          </div>
                          <div style={{ fontSize: 11, color: "#6B7280", textAlign: "center" }}>{a.name}</div>
                        </div>
                      ))}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 64 }}>
                        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 13, color: "#4B5563" }}>+{activeRoom.listeners - AUDIENCE.length}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#4B5563" }}>more</div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                {/* Chat panel */}
                {showChat && (
                  <div style={{ width: 300, borderLeft: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", background: "#030d05" }}>
                    <div style={{ padding: "14px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
                      <Hash size={14} style={{ color: PRIMARY }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#F0FDF4" }}>Chyme chat</span>
                      <Badge style={{ marginLeft: "auto", background: `${PRIMARY}15`, color: PRIMARY, border: `1px solid ${PRIMARY}25`, fontSize: 10 }}>GetStream</Badge>
                    </div>
                    <ScrollArea style={{ flex: 1, padding: "12px 14px" }}>
                      {chatMsgs.map((m) => (
                        <div key={m.id} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: m.user === "You" ? PRIMARY : "#A7F3D0" }}>{m.user}</span>
                            <span style={{ fontSize: 11, color: "#374151" }}>{m.time}</span>
                          </div>
                          <div style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.5 }}>{m.text}</div>
                        </div>
                      ))}
                    </ScrollArea>
                    <div style={{ padding: "10px 14px", borderTop: `1px solid ${BORDER}` }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "8px 12px" }}>
                        <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendChat()} placeholder="Share your thoughts" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#E8EAF0" }} />
                        <button onClick={handleSendChat} style={{ width: 28, height: 28, borderRadius: 6, background: chatInput.trim() ? PRIMARY : "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <Send size={12} style={{ color: chatInput.trim() ? "#fff" : "#4B5563" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Room controls */}
              <div style={{ padding: "16px 24px", borderTop: `1px solid ${BORDER}`, background: "#030d05", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <button onClick={() => setMuted(!muted)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: muted ? "rgba(239,68,68,0.15)" : `${PRIMARY}18`, border: `1px solid ${muted ? "rgba(239,68,68,0.4)" : PRIMARY + "40"}`, color: muted ? "#F87171" : PRIMARY, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  {muted ? <MicOff size={16} /> : <Mic size={16} />}
                  {muted ? "Unmute" : "Mute"}
                </button>
                <button onClick={() => setHandRaised(!handRaised)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: handRaised ? "rgba(234,179,8,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${handRaised ? "rgba(234,179,8,0.4)" : "rgba(255,255,255,0.08)"}`, color: handRaised ? "#FDE047" : "#9CA3AF", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  <Hand size={16} />
                  {handRaised ? "Lower Hand" : "Raise Hand"}
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9CA3AF", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  <Heart size={16} /> React
                </button>
                <div style={{ flex: 1 }} />
                <div style={{ fontSize: 12, color: "#4B5563", display: "flex", alignItems: "center", gap: 6 }}>
                  <Volume2 size={14} />
                  Audio via GetStream
                </div>
                <button onClick={() => setActiveRoom(null)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  <Phone size={16} /> Leave
                </button>
              </div>
            </>
          ) : (
            /* Empty state / welcome */
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
              <div style={{ width: 80, height: 80, borderRadius: 24, background: `${PRIMARY}18`, border: `2px solid ${PRIMARY}35`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <Radio size={36} style={{ color: PRIMARY }} />
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#F0FDF4" }}>No active rooms yet</div>
              <div style={{ fontSize: 15, color: "#4B5563", textAlign: "center", maxWidth: 400, lineHeight: 1.6 }}>
                {isAuthenticated 
                  ? "Create a room to start connecting with other survivors in a safe space, or join an existing room when others create one."
                  : "Sign in to create a room and connect with other survivors in a safe space, or listen to existing rooms."}
              </div>
              <button 
                onClick={handleStartRoom}
                disabled={isAuthenticated === false}
                style={{ 
                  marginTop: 24, 
                  padding: "12px 28px", 
                  borderRadius: 12, 
                  background: isAuthenticated ? `linear-gradient(135deg, ${PRIMARY} 0%, #16A34A 100%)` : "rgba(255,255,255,0.1)", 
                  border: "none", 
                  color: isAuthenticated ? "#fff" : "#9CA3AF",
                  fontSize: 15, 
                  fontWeight: 700, 
                  cursor: isAuthenticated ? "pointer" : "not-allowed",
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8,
                  opacity: isAuthenticated ? 1 : 0.6
                }}>
                <Plus size={16} /> {isAuthenticated ? "Create your first room" : "Sign in to Create Room"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Chyme() {
  return (
    <AuthProvider>
      <ChymeApp onClose={() => {}} />
    </AuthProvider>
  );
}
