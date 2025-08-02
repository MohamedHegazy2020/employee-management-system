/**
 * Avatar utility functions
 */

/**
 * Get initials from a full name or first and last name
 * @param name - Full name or first name
 * @param lastName - Last name (optional)
 * @returns Initials string (e.g., "JD" for "John Doe")
 */
export const getInitials = (name: string, lastName?: string): string => {
  if (!name) return "";

  if (lastName) {
    // If both first and last name are provided
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  } else {
    // If only full name is provided, split by space
    const nameParts = name.trim().split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(
        0
      )}`.toUpperCase();
    } else {
      return name.charAt(0).toUpperCase();
    }
  }
};

/**
 * Get avatar props for PrimeVue Avatar component
 * @param name - Full name or first name
 * @param lastName - Last name (optional)
 * @param image - Image URL (optional)
 * @returns Object with image and label props
 */
export const getAvatarProps = (
  name: string,
  lastName?: string,
  image?: string
) => {
  const initials = getInitials(name, lastName);

  return {
    image: image || undefined,
    label: image ? undefined : initials,
    alt: name,
  };
};

/**
 * Get background color for avatar based on name
 * @param name - Name to generate color from
 * @returns CSS class for background color
 */
export const getAvatarColor = (name: string): string => {
  if (!name) return "bg-gray-500";

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];

  // Simple hash function to get consistent color for same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
