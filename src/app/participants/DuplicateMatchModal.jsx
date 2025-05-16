import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, AlertCircle, Search, Info, X } from "lucide-react";
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
import { useState, useEffect } from "react";

export function DuplicateMatchModal({ 
  isOpen, 
  onClose, 
  duplicateData, 
  onConfirm 
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Card view for mobile
  const renderPersonalMatchesMobile = () => (
    <div className="space-y-3">
      {(duplicateData?.personalMatches?.length > 0) ? duplicateData.personalMatches.map((match, idx) => (
        <div key={idx} className="rounded-lg border border-gray-200 bg-white p-3 flex flex-col gap-2 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#496E22]">{match.fullName}</span>
            <Badge variant="outline" className={getMatchBadgeClass(match.averageMatch)}>
              {match.averageMatch}%
            </Badge>
          </div>
          <div className="text-xs text-gray-500 mb-1">{match.participantId}</div>
          <div className="text-sm"><span className="font-medium">Location:</span> {match.location}</div>
          <div className="text-sm"><span className="font-medium">Birthday:</span> {match.birthday}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className={getMatchBadgeClass(match.nameMatch)}>
              Name: {match.nameMatch}%
            </Badge>
            <Badge variant="outline" className={getMatchBadgeClass(match.soundexMatch)}>
              Soundex: {match.soundexMatch}%
            </Badge>
            <Badge variant="outline" className={getMatchBadgeClass(match.locationMatch)}>
              Location: {match.locationMatch}%
            </Badge>
            <Badge variant="outline" className={getMatchBadgeClass(match.birthdayMatch)}>
              Birthday: {match.birthdayMatch}%
            </Badge>
          </div>
        </div>
      )) : (
        <div className="text-center text-gray-400 py-4">No duplicates found.</div>
      )}
    </div>
  );

  const renderHouseholdMatchesMobile = () => (
    <div className="space-y-3">
      {(duplicateData?.householdMatches?.length > 0) ? duplicateData.householdMatches.map((match, idx) => (
        <div key={idx} className="rounded-lg border border-gray-200 bg-white p-3 flex flex-col gap-2 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#496E22]">{match.householdName}</span>
            <Badge variant="outline" className={getMatchBadgeClass(match.averageMatch)}>
              {match.averageMatch}%
            </Badge>
          </div>
          <div className="text-xs text-gray-500 mb-1">{match.householdId}</div>
          <div className="text-sm"><span className="font-medium">Participant:</span> {match.participantName}</div>
          <div className="text-sm"><span className="font-medium">Location:</span> {match.location}</div>
          <div className="text-sm"><span className="font-medium">Birthday:</span> {match.birthday}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className={getMatchBadgeClass(match.nameMatch)}>
              Name: {match.nameMatch}%
            </Badge>
            <Badge variant="outline" className={getMatchBadgeClass(match.soundexMatch)}>
              Soundex: {match.soundexMatch}%
            </Badge>
            <Badge variant="outline" className={getMatchBadgeClass(match.locationMatch)}>
              Location: {match.locationMatch}%
            </Badge>
            <Badge variant="outline" className={getMatchBadgeClass(match.birthdayMatch)}>
              Birthday: {match.birthdayMatch}%
            </Badge>
          </div>
        </div>
      )) : null}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={
        isMobile
          ? 'fixed inset-0 w-screen h-screen max-w-none max-h-none rounded-none p-0 flex flex-col bg-white'
          : 'w-[1400px] min-w-[80vw] bg-white border-0 p-0 gap-0 rounded-lg'
      }>
        <div className="absolute right-4 top-4 z-10">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <DialogHeader className={`space-y-4 ${isMobile ? 'px-4 pt-6' : 'px-6 pt-6'}`}>
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

        <div className={`space-y-6 ${isMobile ? 'px-4 pb-24' : 'px-6 pb-6'} flex-1 overflow-y-auto`}> 
          {/* Duplicate Personal Information Section */}
          <Card className="border border-gray-100 shadow-sm rounded-lg overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-lg font-semibold text-[#496E22] flex items-center gap-2">
                  <span>Duplicate Personal Informations</span>
                  <Info className="h-4 w-4 text-[#496E22]/60" />
                </CardTitle>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search duplicates..."
                    className="pl-9 w-full sm:max-w-xs border-gray-200 focus:border-[#496E22] focus:ring-[#496E22]/20"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isMobile ? renderPersonalMatchesMobile() : (
                <div className="relative overflow-x-auto rounded-lg border border-gray-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#F5F7F2]">
                        <TableHead className="text-[#496E22] font-semibold whitespace-nowrap">SLP ID</TableHead>
                        <TableHead className="text-[#496E22] font-semibold whitespace-nowrap">FULL NAME</TableHead>
                        <TableHead className="text-[#496E22] font-semibold whitespace-nowrap">LOCATION</TableHead>
                        <TableHead className="text-[#496E22] font-semibold whitespace-nowrap">BIRTHDAY</TableHead>
                        <TableHead className="text-[#496E22] font-semibold text-center whitespace-nowrap">NAME %</TableHead>
                        <TableHead className="text-[#496E22] font-semibold text-center whitespace-nowrap">SOUNDEX %</TableHead>
                        <TableHead className="text-[#496E22] font-semibold text-center whitespace-nowrap">LOCATION %</TableHead>
                        <TableHead className="text-[#496E22] font-semibold text-center whitespace-nowrap">BIRTHDAY %</TableHead>
                        <TableHead className="text-[#496E22] font-semibold text-center whitespace-nowrap">AVG %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {duplicateData?.personalMatches?.map((match, index) => (
                        <TableRow 
                          key={index}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell className="font-medium whitespace-nowrap">{match.participantId}</TableCell>
                          <TableCell className="font-medium whitespace-nowrap">{match.fullName}</TableCell>
                          <TableCell className="whitespace-nowrap">{match.location}</TableCell>
                          <TableCell className="whitespace-nowrap">{match.birthday}</TableCell>
                          <TableCell className="text-center whitespace-nowrap">
                            <Badge variant="outline" className={getMatchBadgeClass(match.nameMatch)}>
                              {match.nameMatch}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center whitespace-nowrap">
                            <Badge variant="outline" className={getMatchBadgeClass(match.soundexMatch)}>
                              {match.soundexMatch}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center whitespace-nowrap">
                            <Badge variant="outline" className={getMatchBadgeClass(match.locationMatch)}>
                              {match.locationMatch}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center whitespace-nowrap">
                            <Badge variant="outline" className={getMatchBadgeClass(match.birthdayMatch)}>
                              {match.birthdayMatch}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center whitespace-nowrap">
                            <Badge variant="outline" className={getMatchBadgeClass(match.averageMatch)}>
                              {match.averageMatch}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Identified Household Section */}
          {duplicateData?.householdMatches?.length > 0 && (
            <Card className="border border-gray-100 shadow-sm rounded-lg overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="text-lg font-semibold text-[#496E22] flex items-center gap-2">
                    <span>Identified Household</span>
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                      Found in Family Compositions
                    </Badge>
                  </CardTitle>
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search households..."
                      className="pl-9 w-full sm:max-w-xs border-gray-200 focus:border-[#496E22] focus:ring-[#496E22]/20"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isMobile ? renderHouseholdMatchesMobile() : (
                  <div className="relative overflow-x-auto rounded-lg border border-gray-100">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#F5F7F2]">
                          <TableHead className="text-[#496E22] font-semibold whitespace-nowrap">HOUSEHOLD ID</TableHead>
                          <TableHead className="text-[#496E22] font-semibold whitespace-nowrap">HOUSEHOLD NAME</TableHead>
                          <TableHead className="text-[#496E22] font-semibold whitespace-nowrap">PARTICIPANT</TableHead>
                          <TableHead className="text-[#496E22] font-semibold whitespace-nowrap">LOCATION</TableHead>
                          <TableHead className="text-[#496E22] font-semibold whitespace-nowrap">BIRTHDAY</TableHead>
                          <TableHead className="text-[#496E22] font-semibold text-center whitespace-nowrap">NAME %</TableHead>
                          <TableHead className="text-[#496E22] font-semibold text-center whitespace-nowrap">SOUNDEX %</TableHead>
                          <TableHead className="text-[#496E22] font-semibold text-center whitespace-nowrap">LOCATION %</TableHead>
                          <TableHead className="text-[#496E22] font-semibold text-center whitespace-nowrap">BIRTHDAY %</TableHead>
                          <TableHead className="text-[#496E22] font-semibold text-center whitespace-nowrap">MATCH %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {duplicateData?.householdMatches?.map((match, index) => (
                          <TableRow 
                            key={index}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <TableCell className="font-medium whitespace-nowrap">{match.householdId}</TableCell>
                            <TableCell className="font-medium whitespace-nowrap">{match.householdName}</TableCell>
                            <TableCell className="whitespace-nowrap">{match.participantName}</TableCell>
                            <TableCell className="whitespace-nowrap">{match.location}</TableCell>
                            <TableCell className="whitespace-nowrap">{match.birthday}</TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                              <Badge variant="outline" className={getMatchBadgeClass(match.nameMatch)}>
                                {match.nameMatch}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                              <Badge variant="outline" className={getMatchBadgeClass(match.soundexMatch)}>
                                {match.soundexMatch}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                              <Badge variant="outline" className={getMatchBadgeClass(match.locationMatch)}>
                                {match.locationMatch}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                              <Badge variant="outline" className={getMatchBadgeClass(match.birthdayMatch)}>
                                {match.birthdayMatch}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center whitespace-nowrap">
                              <Badge variant="outline" className={getMatchBadgeClass(match.averageMatch)}>
                                {match.averageMatch}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter
          className={`${isMobile ? 'fixed bottom-0 left-0 w-full px-4 pb-4 pt-2 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.04)] z-20 flex-col gap-2' : 'px-6 py-4 border-t border-gray-100 flex-col sm:flex-row gap-2'}`}
          style={isMobile ? {} : {}}>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-[#496E22] text-[#496E22] hover:bg-[#496E22]/5 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-[#496E22] text-white hover:bg-[#496E22]/90 w-full sm:w-auto"
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