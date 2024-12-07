export const formatDateAndTime = (dateString) => {
    const date = new Date(dateString);
  
    // Format date to like "Tue, Apr 24"
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);
  
    // Format time to like "10:43 AM"
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
  
    return { formattedDate, formattedTime };
  }