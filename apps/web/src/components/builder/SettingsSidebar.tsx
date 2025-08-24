import { Settings, Search, Palette, Shield, Database } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SettingsSidebar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col h-full md:h-full max-h-[35vh] md:max-h-none">
      <div className="flex-shrink-0 p-3 sm:p-4 border-b">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Settings</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm sm:text-base"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-auto max-h-[calc(35vh-8rem)] md:max-h-none">
        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
          {/* Form Settings */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 pl-3 sm:pl-4">
              Form Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="required-validation" className="text-sm">Required Field Validation</Label>
                </div>
                <Switch id="required-validation" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="auto-save" className="text-sm">Auto Save</Label>
                </div>
                <Switch id="auto-save" />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 pl-3 sm:pl-4">
              Appearance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="dark-mode" className="text-sm">Dark Mode</Label>
                </div>
                <Switch id="dark-mode" />
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 pl-3 sm:pl-4">
              Advanced
            </h3>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Custom Validation</span>
                </div>
                <p className="text-xs text-muted-foreground">Configure custom validation rules</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}