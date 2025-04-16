import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, AlertCircle, Search, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DuplicateMatchModal({ 
  isOpen, 
  onClose, 
  duplicateData, 
  onConfirm 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} className="w-screen">
      <DialogContent className="w-[1400px] min-w-[80vw] bg-white border-0 p-0 gap-0 rounded-lg">
        <div className="absolute right-4 top-4">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <DialogHeader className="space-y-4 px-6 pt-6">
          <DialogTitle className="text-xl font-semibold">
            Matching Result/s
          </DialogTitle>
          <div className="flex items-center gap-3 bg-[#F5F7F2] p-4 rounded-xl border border-[#496E22]/20">
            <AlertCircle className="h-5 w-5 text-[#496E22] flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#496E22]">
                {duplicateData?.personalMatches?.length || 0} duplicate/s found and {duplicateData?.householdMatches?.length || 0} possible household found
              </p>
              <p className="text-xs text-[#496E22]/80">
                Please review the matching results before proceeding with the registration.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 px-6 pb-6">
          {/* Duplicate Personal Information Section */}
          <Card className="border border-gray-100 shadow-sm rounded-lg overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[#496E22] flex items-center gap-2">
                  <span>Duplicate Personal Informations</span>
                  <Info className="h-4 w-4 text-[#496E22]/60" />
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search duplicates..."
                    className="pl-9 max-w-xs border-gray-200 focus:border-[#496E22] focus:ring-[#496E22]/20"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-hidden rounded-lg border border-gray-100">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F5F7F2]">
                      <TableHead className="text-[#496E22] font-semibold">SLP PARTICIPANT ID</TableHead>
                      <TableHead className="text-[#496E22] font-semibold">FULL NAME</TableHead>
                      <TableHead className="text-[#496E22] font-semibold">LOCATION</TableHead>
                      <TableHead className="text-[#496E22] font-semibold">BIRTHDAY</TableHead>
                      <TableHead className="text-[#496E22] font-semibold text-center">NAME %</TableHead>
                      <TableHead className="text-[#496E22] font-semibold text-center">SOUNDEX %</TableHead>
                      <TableHead className="text-[#496E22] font-semibold text-center">LOCATION %</TableHead>
                      <TableHead className="text-[#496E22] font-semibold text-center">BIRTHDAY %</TableHead>
                      <TableHead className="text-[#496E22] font-semibold text-center">MATCHING RESULT AVERAGE  %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {duplicateData?.personalMatches?.map((match, index) => (
                      <TableRow 
                        key={index}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="font-medium">{match.participantId}</TableCell>
                        <TableCell className="font-medium">{match.fullName}</TableCell>
                        <TableCell>{match.location}</TableCell>
                        <TableCell>{match.birthday}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getMatchBadgeClass(match.nameMatch)}>
                            {match.nameMatch}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getMatchBadgeClass(match.soundexMatch)}>
                            {match.soundexMatch}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getMatchBadgeClass(match.locationMatch)}>
                            {match.locationMatch}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getMatchBadgeClass(match.birthdayMatch)}>
                            {match.birthdayMatch}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={getMatchBadgeClass(match.averageMatch)}>
                            {match.averageMatch}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Identified Household Section */}
          {duplicateData?.householdMatches?.length > 0 && (
            <Card className="border border-gray-100 shadow-sm rounded-lg overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-[#496E22] flex items-center gap-2">
                    <span>Identified Household</span>
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                      Found in Family Compositions
                    </Badge>
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search households..."
                      className="pl-9 max-w-xs border-gray-200 focus:border-[#496E22] focus:ring-[#496E22]/20"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-hidden rounded-lg border border-gray-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#F5F7F2]">
                        <TableHead className="text-[#496E22] font-semibold">SLP HOUSEHOLD ID</TableHead>
                        <TableHead className="text-[#496E22] font-semibold">HOUSEHOLD NAME</TableHead>
                        <TableHead className="text-[#496E22] font-semibold">SLP PARTICIPANT</TableHead>
                        <TableHead className="text-[#496E22] font-semibold">LOCATION</TableHead>
                        <TableHead className="text-[#496E22] font-semibold">BIRTHDAY</TableHead>
                        <TableHead className="text-[#496E22] font-semibold text-center">NAME %</TableHead>
                        <TableHead className="text-[#496E22] font-semibold text-center">SOUNDEX %</TableHead>
                        <TableHead className="text-[#496E22] font-semibold text-center">LOCATION %</TableHead>
                        <TableHead className="text-[#496E22] font-semibold text-center">BIRTHDAY %</TableHead>
                        <TableHead className="text-[#496E22] font-semibold text-center">MATCHING %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {duplicateData?.householdMatches?.map((match, index) => (
                        <TableRow 
                          key={index}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell className="font-medium">{match.householdId}</TableCell>
                          <TableCell className="font-medium">{match.householdName}</TableCell>
                          <TableCell>{match.participantName}</TableCell>
                          <TableCell>{match.location}</TableCell>
                          <TableCell>{match.birthday}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={getMatchBadgeClass(match.nameMatch)}>
                              {match.nameMatch}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={getMatchBadgeClass(match.soundexMatch)}>
                              {match.soundexMatch}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={getMatchBadgeClass(match.locationMatch)}>
                              {match.locationMatch}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={getMatchBadgeClass(match.birthdayMatch)}>
                              {match.birthdayMatch}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={getMatchBadgeClass(match.averageMatch)}>
                              {match.averageMatch}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-[#496E22] text-[#496E22] hover:bg-[#496E22]/5"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-[#496E22] text-white hover:bg-[#496E22]/90"
          >
            Confirm Registration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to determine badge color based on match percentage
function getMatchBadgeClass(percentage) {
  if (percentage >= 90) {
    return "bg-red-50 text-red-600 border-red-200";
  } else if (percentage >= 70) {
    return "bg-amber-50 text-amber-600 border-amber-200";
  } else {
    return "bg-emerald-50 text-emerald-600 border-emerald-200";
  }
} 