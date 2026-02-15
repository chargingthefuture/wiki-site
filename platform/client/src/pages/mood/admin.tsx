import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Bell } from "lucide-react";

export default function MoodAdmin() {

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <Link href="/apps">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Mood Analytics</h1>
          <p className="text-muted-foreground">
            Monitor mood check submissions and manage announcements
          </p>
        </div>
      </div>

      {/* Announcement Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Announcements
          </CardTitle>
          <CardDescription>
            Create and manage announcements for mood check users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/apps/mood/admin/announcements">
            <Button className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Manage Announcements
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle>About Mood Checks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Mood checks are completely anonymous with no user tracking</p>
          <p>• Safety alerts trigger on 3+ very sad (1/5) moods in 7 days</p>
          <p>• All data is aggregate-only and never personalized</p>
        </CardContent>
      </Card>
    </div>
  );
}
