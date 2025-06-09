import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDriveLink, setNewDriveLink] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [newCourseImage, setNewCourseImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingCourse, setAddingCourse] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      setAddingCourse(true);
      setError(null);
      await axios.post('/api/courses', {
        driveLink: newDriveLink,
        name: newCourseName,
        description: newCourseDescription,
        imageLink: newCourseImage,
      });
      setNewDriveLink('');
      setNewCourseName('');
      setNewCourseDescription('');
      setNewCourseImage('');
      setShowAddModal(false);
      await fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
      setError(error.response?.data?.error || 'Failed to add course. Please try again.');
    } finally {
      setAddingCourse(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Course Explorer</h1>
            <p className="text-gray-600">Organize and access your course materials</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Add New Course
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading your courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm"
          >
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Courses Yet</h2>
            <p className="text-gray-600 mb-6">Get started by adding your first course</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Add Your First Course
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Link href={`/course/${course._id}`} key={course._id}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow p-6 cursor-pointer border border-gray-100 flex flex-col justify-between items-start min-h-48"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">📚</div>
                    <div className="text-sm text-gray-500">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h2>
                  <p className="text-gray-600 line-clamp-2">{course.description}</p>
                  {course.imageLink && (
                    <img
                      src={course.imageLink}
                      alt={course.name}
                      className="mt-4 w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Course</h2>
              <form onSubmit={handleAddCourse}>
                <div className="mb-4">
                  <label htmlFor="driveLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Google Drive Link
                  </label>
                  <input
                    id="driveLink"
                    type="text"
                    value={newDriveLink}
                    onChange={(e) => setNewDriveLink(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={addingCourse}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>
                  <input
                    id="courseName"
                    type="text"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="e.g., Introduction to React"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={addingCourse}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newCourseDescription}
                    onChange={(e) => setNewCourseDescription(e.target.value)}
                    placeholder="A brief overview of the course content..."
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={addingCourse}
                  ></textarea>
                </div>
                <div className="mb-6">
                  <label htmlFor="imageLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Optional Image Link
                  </label>
                  <input
                    id="imageLink"
                    type="url"
                    value={newCourseImage}
                    onChange={(e) => setNewCourseImage(e.target.value)}
                    placeholder="https://example.com/course-image.jpg"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={addingCourse}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={addingCourse}
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={addingCourse}
                  >
                    {addingCourse ? 'Adding...' : 'Add Course'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
