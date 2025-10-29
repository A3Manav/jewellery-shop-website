import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Eye,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../contexts/AuthContext";

function AdminManageContacts() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    subject: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch contacts
  const fetchContacts = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters,
      });

      const response = await axios.get(`/api/contacts?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setContacts(response.data.contacts);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/contacts/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchContacts();
      fetchStats();
    }
  }, [filters, user]);

  // Update contact status
  const updateContactStatus = async (contactId, status) => {
    try {
      await axios.put(
        `/api/contacts/${contactId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Contact status updated");
      fetchContacts(currentPage);
      fetchStats();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Delete contact
  const deleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;

    try {
      await axios.delete(`/api/contacts/${contactId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Contact deleted");
      fetchContacts(currentPage);
      fetchStats();
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "unread":
        return "bg-red-100 text-red-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "responded":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "unread":
        return <AlertCircle className="w-4 h-4" />;
      case "read":
        return <Eye className="w-4 h-4" />;
      case "responded":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get subject display name
  const getSubjectDisplayName = (subject) => {
    const subjects = {
      general: "General Inquiry",
      "custom-order": "Custom Order",
      repair: "Jewelry Repair",
      return: "Return/Exchange",
      complaint: "Complaint",
      feedback: "Feedback",
    };
    return subjects[subject] || subject;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Admin Header - Mobile First */}
      <div className="bg-gradient-to-br from-amber-700 via-amber-600 to-orange-600 text-white">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-black bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300 hover:scale-105 touch-manipulation shadow-lg border border-white border-opacity-30"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </button>
            <div className="sm:ml-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex items-center">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-amber-200 mr-2 sm:mr-3" />
                Manage Contacts
              </h1>
              <p className="text-amber-100 mt-1 text-sm sm:text-base">
                View and manage contact form submissions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Statistics Cards - Mobile First */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 mb-2 sm:mb-0" />
                <div className="sm:ml-3 lg:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Contacts
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mb-2 sm:mb-0" />
                <div className="sm:ml-3 lg:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Unread
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
                    {stats.unread}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mb-2 sm:mb-0" />
                <div className="sm:ml-3 lg:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Read
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">
                    {stats.read}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mb-2 sm:mb-0" />
                <div className="sm:ml-3 lg:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Responded
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                    {stats.responded}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters - Mobile First */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent touch-manipulation"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent touch-manipulation"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent touch-manipulation"
                value={filters.subject}
                onChange={(e) =>
                  setFilters({ ...filters, subject: e.target.value })
                }
              >
                <option value="">All Subjects</option>
                <option value="general">General Inquiry</option>
                <option value="custom-order">Custom Order</option>
                <option value="repair">Jewelry Repair</option>
                <option value="return">Return/Exchange</option>
                <option value="complaint">Complaint</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ status: "", subject: "", search: "" });
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-base font-medium touch-manipulation"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Contacts List - Mobile First Design */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading contacts...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No contacts found</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden">
                <div className="divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <div
                      key={contact._id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 truncate">
                            {contact.name}
                          </h3>
                          <div className="mt-1 text-sm text-gray-600 flex items-center">
                            <Mail className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600 flex items-center">
                            <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span>{contact.phone}</span>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            contact.status
                          )} ml-2`}
                        >
                          {getStatusIcon(contact.status)}
                          <span className="ml-1 capitalize">
                            {contact.status}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span className="font-medium">
                          {getSubjectDisplayName(contact.subject)}
                        </span>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(contact.createdAt)}
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors touch-manipulation"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {contact.status === "unread" && (
                          <button
                            onClick={() =>
                              updateContactStatus(contact._id, "read")
                            }
                            className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors touch-manipulation"
                            title="Mark as Read"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        )}
                        {contact.status === "read" && (
                          <button
                            onClick={() =>
                              updateContactStatus(contact._id, "responded")
                            }
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors touch-manipulation"
                            title="Mark as Responded"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteContact(contact._id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <tr key={contact._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {contact.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {contact.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {contact.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {getSubjectDisplayName(contact.subject)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              contact.status
                            )}`}
                          >
                            {getStatusIcon(contact.status)}
                            <span className="ml-1 capitalize">
                              {contact.status}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(contact.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedContact(contact)}
                              className="text-amber-600 hover:text-amber-900 p-1"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {contact.status === "unread" && (
                              <button
                                onClick={() =>
                                  updateContactStatus(contact._id, "read")
                                }
                                className="text-yellow-600 hover:text-yellow-900 p-1"
                                title="Mark as Read"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            {contact.status === "read" && (
                              <button
                                onClick={() =>
                                  updateContactStatus(contact._id, "responded")
                                }
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Mark as Responded"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteContact(contact._id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Mobile-First Responsive Pagination */}
          {totalPages > 1 && (
            <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6">
              {/* Mobile Pagination */}
              <div className="flex justify-between items-center sm:hidden">
                <button
                  onClick={() => fetchContacts(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => fetchContacts(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  Next
                </button>
              </div>

              {/* Desktop Pagination */}
              <div className="hidden sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page{" "}
                    <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => fetchContacts(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = Math.max(1, currentPage - 2) + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchContacts(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === currentPage
                              ? "z-10 bg-amber-50 border-amber-500 text-amber-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => fetchContacts(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile-First Responsive Contact Details Modal */}
        {selectedContact && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedContact(null)}
          >
            <div
              className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white rounded-t-lg">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Contact Details
                </h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                >
                  <span className="text-xl sm:text-2xl">&times;</span>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <p className="text-sm sm:text-base text-gray-900">
                        {selectedContact.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-sm sm:text-base text-gray-900">
                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="text-amber-600 hover:underline break-all"
                        >
                          {selectedContact.email}
                        </a>
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <p className="text-sm sm:text-base text-gray-900">
                        <a
                          href={`tel:${selectedContact.phone}`}
                          className="text-amber-600 hover:underline"
                        >
                          {selectedContact.phone}
                        </a>
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <p className="text-sm sm:text-base text-gray-900">
                        {getSubjectDisplayName(selectedContact.subject)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedContact.status
                        )}`}
                      >
                        {getStatusIcon(selectedContact.status)}
                        <span className="ml-1 capitalize">
                          {selectedContact.status}
                        </span>
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Submitted
                      </label>
                      <p className="text-sm sm:text-base text-gray-900">
                        {formatDate(selectedContact.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-sm sm:text-base text-gray-900 whitespace-pre-wrap break-words">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                {selectedContact.status === "unread" && (
                  <button
                    onClick={() => {
                      updateContactStatus(selectedContact._id, "read");
                      setSelectedContact({
                        ...selectedContact,
                        status: "read",
                      });
                    }}
                    className="w-full sm:w-auto px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-base font-medium touch-manipulation"
                  >
                    Mark as Read
                  </button>
                )}
                {selectedContact.status === "read" && (
                  <button
                    onClick={() => {
                      updateContactStatus(selectedContact._id, "responded");
                      setSelectedContact({
                        ...selectedContact,
                        status: "responded",
                      });
                    }}
                    className="w-full sm:w-auto px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-base font-medium touch-manipulation"
                  >
                    Mark as Responded
                  </button>
                )}
                <button
                  onClick={() => {
                    deleteContact(selectedContact._id);
                    setSelectedContact(null);
                  }}
                  className="w-full sm:w-auto px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-base font-medium touch-manipulation"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="w-full sm:w-auto px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-base font-medium touch-manipulation"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminManageContacts;
