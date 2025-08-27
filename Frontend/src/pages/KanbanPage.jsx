import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { 
  Plus, Search, Filter, ExternalLink, Calendar, User, Briefcase, TrendingUp,
  FileText, Clock, CheckCircle, XCircle, Award, Download, Mail, Phone, MapPin,
  Star, Edit, Trash2, Users, BarChart3, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AddCandidateModal from "@/components/AddCandidateModal";
import { candidateAPI } from "@/services/api";

const COLUMN_CONFIG = {
  applied: { 
    title: "Applied", 
    color: "bg-blue-500", 
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    count: 0,
    icon: FileText
  },
  interview: { 
    title: "Interview", 
    color: "bg-yellow-500", 
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-700",
    count: 0,
    icon: Clock
  },
  offer: { 
    title: "Offer", 
    color: "bg-green-500", 
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    count: 0,
    icon: Award
  },
  rejected: { 
    title: "Rejected", 
    color: "bg-red-500", 
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    count: 0,
    icon: XCircle
  }
};

const KanbanPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingCandidate, setDeletingCandidate] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Edit handler
  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      const response = await candidateAPI.update(editingCandidate._id, updatedData);
      setCandidates(prev => prev.map(c => c._id === editingCandidate._id ? response.data.data : c));
      setIsEditModalOpen(false);
      setEditingCandidate(null);
      toast({
        title: "Success",
        description: "Candidate updated successfully",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update candidate",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />
      });
    }
  };

  // Delete handler
  const handleDeleteCandidate = (candidate) => {
    setDeletingCandidate(candidate);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteCandidate = async () => {
    if (!deletingCandidate) return;
    try {
      await candidateAPI.delete(deletingCandidate._id);
      setCandidates(prev => prev.filter(c => c._id !== deletingCandidate._id));
      setIsDeleteConfirmOpen(false);
      setDeletingCandidate(null);
      toast({
        title: "Deleted",
        description: "Candidate deleted successfully",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete candidate",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />
      });
    }
  };

  // Load candidates
  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const response = await candidateAPI.getAll();
        setCandidates(response.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load candidates:", error);
        setError("Failed to load candidates. Please try again later.");
        setCandidates([]);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load candidates data",
          variant: "destructive",
          icon: <AlertCircle className="h-5 w-5" />
        });
      }
    };

    loadCandidates();
  }, [toast]);

  // Handle drag end
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const candidateId = draggableId;
    const newStatus = destination.droppableId;

    // Update local state immediately
    setCandidates(prev => 
      prev.map(candidate => 
        candidate._id === candidateId 
          ? { ...candidate, status: newStatus }
          : candidate
      )
    );

    try {
      await candidateAPI.updateStatus(candidateId, newStatus);
      toast({
        title: "Status Updated",
        description: `Candidate moved to ${COLUMN_CONFIG[newStatus].title}`,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
    } catch (error) {
      console.error("Failed to update candidate status:", error);
      // Revert on error
      setCandidates(prev => 
        prev.map(candidate => 
          candidate._id === candidateId 
            ? { ...candidate, status: result.source.droppableId }
            : candidate
        )
      );
      toast({
        title: "Error",
        description: "Failed to update candidate status",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />
      });
    }
  };

  // Add new candidate
  const handleAddCandidate = async (candidateData) => {
    try {
      const response = await candidateAPI.create(candidateData);
      const newCandidate = response.data.data;
      
      setCandidates(prev => [...prev, newCandidate]);
      setIsModalOpen(false);
      
      toast({
        title: "Success",
        description: "New candidate added successfully",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
    } catch (error) {
      console.error("Failed to add candidate:", error);
      toast({
        title: "Error",
        description: "Failed to add candidate",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />
      });
    }
  };

  // Filter candidates
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.role?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    const matchesExperience = !experienceFilter || candidate.experience >= parseInt(experienceFilter);
    return matchesSearch && matchesStatus && matchesExperience;
  });

  // Group candidates by status
  const groupedCandidates = Object.keys(COLUMN_CONFIG).reduce((acc, status) => {
    acc[status] = filteredCandidates.filter(candidate => candidate.status === status);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section with Tailwind gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-xl p-8 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-blue-200" />
              <h1 className="text-4xl font-extrabold tracking-tight text-white">Vigneswar Job Tracker</h1>
            </div>
            <p className="text-blue-100 text-lg opacity-90 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Track and manage job candidates across different stages
            </p>
          </div>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold flex items-center gap-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Stats Cards with Tailwind utilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(COLUMN_CONFIG).map(([status, config]) => {
          const IconComponent = config.icon;
          return (
            <Card key={status} className={`p-6 border-l-4 ${config.borderColor} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <IconComponent className="h-4 w-4" />
                    {config.title}
                  </p>
                  <p className={`text-3xl font-bold ${config.textColor} mt-1`}>{groupedCandidates[status].length}</p>
                </div>
                <div className={`h-12 w-12 rounded-full ${config.color} flex items-center justify-center shadow-md`}>
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters Section with Tailwind styling */}
      <Card className="p-6 shadow-sm border-0 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-foreground transition-all duration-200 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {Object.entries(COLUMN_CONFIG).map(([status, config]) => (
                <option key={status} value={status}>{config.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-muted-foreground" />
            <select 
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-foreground transition-all duration-200 cursor-pointer"
            >
              <option value="">Any Experience</option>
              <option value="0">0+ years</option>
              <option value="1">1+ years</option>
              <option value="3">3+ years</option>
              <option value="5">5+ years</option>
              <option value="7">7+ years</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Kanban Board with enhanced Tailwind styling */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(COLUMN_CONFIG).map(([status, config]) => {
            const StatusIcon = config.icon;
            const columnCandidates = groupedCandidates[status];
            
            return (
              <div key={status} className="flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full ${config.color} shadow-sm`} />
                    <StatusIcon className={`h-5 w-5 ${config.textColor}`} />
                    <h2 className="text-xl font-bold text-foreground">{config.title}</h2>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${config.bgColor} ${config.textColor} shadow-sm flex items-center gap-1`}>
                    <Users className="h-4 w-4" />
                    {columnCandidates.length}
                  </span>
                </div>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`
                        flex-1 rounded-xl border-2 border-dashed p-4 transition-all duration-300 min-h-[400px]
                        ${snapshot.isDraggingOver 
                          ? `${config.borderColor} ${config.bgColor} border-solid shadow-lg` 
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }
                      `}
                    >
                      {columnCandidates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <StatusIcon className="h-12 w-12 mb-4 opacity-50" />
                          <p className="text-center">No candidates in {config.title.toLowerCase()}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {columnCandidates.map((candidate, index) => (
                            <Draggable 
                              key={candidate._id} 
                              draggableId={candidate._id} 
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`
                                    transition-all duration-300
                                    ${snapshot.isDragging ? 'opacity-75 rotate-2 scale-105 shadow-2xl z-50' : 'hover:scale-105'}
                                  `}
                                >
                                  <Card className="p-6 shadow-md hover:shadow-xl transition-all duration-300 border-0 bg-white cursor-grab active:cursor-grabbing">
                                    <div className="space-y-4">
                                      {/* Header */}
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                                            <User className="h-5 w-5 text-white" />
                                          </div>
                                          <div>
                                            <h3 className="font-bold text-foreground text-lg truncate">{candidate.name}</h3>
                                            <p className="text-sm text-muted-foreground">Candidate</p>
                                          </div>
                                        </div>
                                        <div className="flex gap-1">
                                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditCandidate(candidate)}>
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteCandidate(candidate)}>
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>

                                      {/* Contact Info */}
                                      <div className="space-y-2">
                                        {candidate.email && (
                                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            <span className="truncate">{candidate.email}</span>
                                          </div>
                                        )}
                                        {candidate.phone && (
                                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone className="h-4 w-4" />
                                            <span>{candidate.phone}</span>
                                          </div>
                                        )}
                                        {candidate.location && (
                                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span className="truncate">{candidate.location}</span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Role */}
                                      <div className="flex items-center gap-2 text-sm">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-semibold text-foreground">{candidate.role}</span>
                                      </div>

                                      {/* Experience */}
                                      <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
                                        <span className="text-muted-foreground flex items-center gap-1">
                                          <Star className="h-4 w-4" />
                                          Experience:
                                        </span>
                                        <span className="font-bold text-foreground">{candidate.experience} years</span>
                                      </div>

                                      {/* Applied Date */}
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        <span>Applied: {new Date(candidate.appliedDate).toLocaleDateString()}</span>
                                      </div>

                                      {/* Action Buttons */}
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => window.open(candidate.resumeLink, '_blank')}
                                          className="flex-1 justify-center gap-2 hover:bg-blue-500 hover:text-white transition-all duration-200 border-2 hover:border-blue-500"
                                        >
                                          <ExternalLink className="h-4 w-4" />
                                          View Resume
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="hover:bg-green-500 hover:text-white transition-all duration-200 border-2 hover:border-green-500"
                                        >
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {candidates.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Candidates Yet</h3>
          <p className="text-muted-foreground mb-6">Get started by adding your first candidate to the tracker</p>
          <Button onClick={() => setIsModalOpen(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add First Candidate
          </Button>
        </Card>
      )}

      <AddCandidateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCandidate}
      />
      {/* Edit Modal */}
      {isEditModalOpen && (
        <AddCandidateModal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setEditingCandidate(null); }}
          onSubmit={handleEditSubmit}
          initialData={editingCandidate}
          isEdit={true}
        />
      )}
      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Candidate?</h3>
            <p className="mb-6 text-muted-foreground">Are you sure you want to delete <span className="font-bold">{deletingCandidate?.name}</span>? This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <Button variant="outline" onClick={() => { setIsDeleteConfirmOpen(false); setDeletingCandidate(null); }}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDeleteCandidate}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanPage;