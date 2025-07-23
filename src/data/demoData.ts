
export const initializeDemoData = () => {
  // Check if demo data already exists
  if (localStorage.getItem('servicedesk_demo_initialized')) {
    return;
  }

  // Demo users
  const demoUsers = [
    {
      id: 'admin-001',
      email: 'admin@servicedesk.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'user-001',
      email: 'user@demo.com',
      password: 'user123',
      name: 'Demo User',
      role: 'user',
      createdAt: '2024-01-15T00:00:00.000Z',
    },
    {
      id: 'user-002',
      email: 'sarah@company.com',
      password: 'sarah123',
      name: 'Sarah Johnson',
      role: 'user',
      createdAt: '2024-02-01T00:00:00.000Z',
    },
  ];

  // Demo tickets
  const demoTickets = [
    {
      id: 'ticket-001',
      title: 'Unable to access dashboard',
      description: 'I am experiencing issues logging into my dashboard. The page keeps loading but never completes. This has been happening since yesterday morning. I have tried clearing my browser cache and using different browsers but the issue persists.',
      category: 'technical',
      priority: 'high',
      status: 'open',
      userId: 'user-001',
      userName: 'Demo User',
      userEmail: 'user@demo.com',
      createdAt: '2024-07-01T09:00:00.000Z',
      updatedAt: '2024-07-01T09:00:00.000Z',
      comments: [
        {
          id: 'comment-001',
          ticketId: 'ticket-001',
          userId: 'admin-001',
          userName: 'Admin User',
          content: 'Thank you for reporting this issue. We are investigating the dashboard access problem and will update you soon.',
          createdAt: '2024-07-01T10:30:00.000Z',
          isInternal: false,
        },
      ],
    },
    {
      id: 'ticket-002',
      title: 'Request for additional user licenses',
      description: 'Our team has grown and we need to add 5 more user licenses to our current plan. Please let me know the process and pricing for additional licenses.',
      category: 'billing',
      priority: 'medium',
      status: 'in-progress',
      userId: 'user-002',
      userName: 'Sarah Johnson',
      userEmail: 'sarah@company.com',
      assignedTo: 'Admin User',
      createdAt: '2024-06-30T14:20:00.000Z',
      updatedAt: '2024-06-30T16:45:00.000Z',
      comments: [
        {
          id: 'comment-002',
          ticketId: 'ticket-002',
          userId: 'admin-001',
          userName: 'Admin User',
          content: 'I have forwarded your request to our billing team. They will contact you within 24 hours with pricing and upgrade options.',
          createdAt: '2024-06-30T16:45:00.000Z',
          isInternal: false,
        },
      ],
    },
    {
      id: 'ticket-003',
      title: 'Feature request: Dark mode support',
      description: 'It would be great to have a dark mode option for the interface. Many team members work in low-light environments and this would improve their experience significantly.',
      category: 'feature-request',
      priority: 'low',
      status: 'resolved',
      userId: 'user-001',
      userName: 'Demo User',
      userEmail: 'user@demo.com',
      createdAt: '2024-06-28T11:15:00.000Z',
      updatedAt: '2024-06-29T13:20:00.000Z',
      comments: [
        {
          id: 'comment-003',
          ticketId: 'ticket-003',
          userId: 'admin-001',
          userName: 'Admin User',
          content: 'Thank you for the suggestion! Dark mode is actually on our roadmap for the next quarter. We will keep you updated on the progress.',
          createdAt: '2024-06-29T13:20:00.000Z',
          isInternal: false,
        },
      ],
    },
  ];

  // Store demo data
  localStorage.setItem('servicedesk_users', JSON.stringify(demoUsers));
  localStorage.setItem('servicedesk_tickets', JSON.stringify(demoTickets));
  localStorage.setItem('servicedesk_demo_initialized', 'true');

  console.log('Demo data initialized successfully!');
  console.log('Available demo accounts:');
  console.log('Admin: admin@servicedesk.com / admin123');
  console.log('User: user@demo.com / user123');
};
