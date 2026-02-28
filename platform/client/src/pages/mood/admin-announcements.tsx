import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MoodAnnouncement } from "@shared/schema";
import { insertMoodAnnouncementSchema } from "@shared/schema";
import { format } from "date-fns";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "wouter";

const announcementFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["info", "warning", "maintenance", "update", "promotion"]),
  expiresAt: z.string().optional(),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

export default function MoodAdminAnnouncements() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "info",
      expiresAt: "",
    },
  });

  // Fetch all announcements
  const { data: announcements = [], isLoading, refetch } = useQuery<MoodAnnouncement[]>({
    queryKey: ["/api/mood/announcements/all"],
  });

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: AnnouncementFormValues) => {
      if (editingId) {
        const response = await apiRequest("PATCH", `/api/mood/announcements/${editingId}`, {
          ...data,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        });
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/mood/announcements", {
          ...data,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        });
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: editingId ? "Announcement updated" : "Announcement created",
      });
      form.reset();
      setIsEditing(false);
      setEditingId(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/mood/announcements"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save announcement",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/mood/announcements/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement deleted",
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/mood/announcements"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete announcement",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AnnouncementFormValues) => {
    mutation.mutate(data);
  };

  const handleEdit = (announcement: MoodAnnouncement) => {
    setEditingId(announcement.id);
    setIsEditing(true);
    form.reset({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type as any,
      expiresAt: announcement.expiresAt 
        ? format(new Date(announcement.expiresAt), "yyyy-MM-dd")
        : "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    form.reset();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <Link href="/apps/mood/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Manage Announcements</h1>
          <p className="text-muted-foreground">Create and manage mood app announcements</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Announcement" : "Create Announcement"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Announcement title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Announcement content" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="promotion">Promotion</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires At (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : isEditing ? "Update" : "Create"}
                </Button>
                {isEditing && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <Card>
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p className="text-muted-foreground">No announcements yet</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(announcement.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${announcement.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Type: {announcement.type}</span>
                    <span>Status: {announcement.isActive ? "Active" : "Inactive"}</span>
                    {announcement.expiresAt && (
                      <span>Expires: {format(new Date(announcement.expiresAt), "MMM d, yyyy")}</span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(announcement)}
                    data-testid={`button-edit-${announcement.id}`}
                  >
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
