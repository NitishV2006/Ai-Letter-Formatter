export interface Template {
  id: string;
  title: string;
  category: 'Student' | 'Faculty' | 'Corporate' | 'Investor';
  icon: string;
  description: string;
  isCustom?: boolean;
  customFields?: CustomField[];
  permissions?: TemplatePermission[];
  knowledgeBaseIds?: string[];
}

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  options?: string[];
  required: boolean;
  placeholder?: string;
}

export interface TemplatePermission {
  userId?: string;
  role?: string;
  access: 'view' | 'edit' | 'admin';
}

export interface KnowledgeBaseItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  permissions?: TemplatePermission[];
}

export const templates: Template[] = [
  {
    id: '1',
    title: 'Sick Leave Application',
    category: 'Student',
    icon: 'FileText',
    description: 'Request sick leave with medical documentation'
  },
  {
    id: '2',
    title: 'Scholarship Application',
    category: 'Student',
    icon: 'GraduationCap',
    description: 'Apply for academic scholarships and financial aid'
  },
  {
    id: '3',
    title: 'Internship Request Letter',
    category: 'Student',
    icon: 'Briefcase',
    description: 'Request internship opportunities'
  },
  {
    id: '4',
    title: 'Leave of Absence',
    category: 'Faculty',
    icon: 'FileText',
    description: 'Request extended leave from teaching duties'
  },
  {
    id: '5',
    title: 'Research Grant Proposal',
    category: 'Faculty',
    icon: 'GraduationCap',
    description: 'Propose research projects for funding'
  },
  {
    id: '6',
    title: 'Employment Offer Letter',
    category: 'Corporate',
    icon: 'Briefcase',
    description: 'Formal job offer with terms and conditions'
  },
  {
    id: '7',
    title: 'Resignation Letter',
    category: 'Corporate',
    icon: 'FileText',
    description: 'Professional resignation notice'
  },
  {
    id: '8',
    title: 'Business Proposal',
    category: 'Corporate',
    icon: 'Briefcase',
    description: 'Propose business partnerships and collaborations'
  },
  {
    id: '9',
    title: 'Legal Notice',
    category: 'Corporate',
    icon: 'Scale',
    description: 'Formal legal communication'
  },
  {
    id: '10',
    title: 'Investment Pitch Letter',
    category: 'Investor',
    icon: 'Briefcase',
    description: 'Present investment opportunities'
  },
  {
    id: '11',
    title: 'Due Diligence Request',
    category: 'Investor',
    icon: 'Scale',
    description: 'Request detailed business information'
  },
  {
    id: '12',
    title: 'Term Sheet Proposal',
    category: 'Investor',
    icon: 'FileText',
    description: 'Outline investment terms and conditions'
  },
  {
    id: 'sample-custom-1',
    title: 'Custom Project Proposal',
    category: 'Corporate',
    icon: 'FileText',
    description: 'Customizable project proposal with dynamic fields',
    isCustom: true,
    customFields: [
      {
        id: 'field-1',
        label: 'Project Name',
        type: 'text',
        required: true,
        placeholder: 'Enter project name'
      },
      {
        id: 'field-2',
        label: 'Project Budget',
        type: 'text',
        required: true,
        placeholder: '$0,000'
      },
      {
        id: 'field-3',
        label: 'Timeline',
        type: 'select',
        required: true,
        options: ['1-3 months', '3-6 months', '6-12 months', '12+ months']
      },
      {
        id: 'field-4',
        label: 'Project Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the project scope and objectives'
      },
      {
        id: 'field-5',
        label: 'Expected Start Date',
        type: 'date',
        required: false
      }
    ]
  }
];

export function generateLetter(
  template: Template,
  userInput: string,
  tone: string,
  includeCompliance: boolean,
  accountData?: {
    fullName?: string;
    title?: string;
    email?: string;
    phone?: string;
    organization?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    signature?: string;
  }
): string {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const complianceNote = includeCompliance
    ? '\n\nThis letter has been generated in compliance with professional standards and regulations as of 2025.'
    : '';

  // Create sender signature block
  const senderName = accountData?.fullName || '[Your Name]';
  const senderTitle = accountData?.title || '[Your Title]';
  const senderOrg = accountData?.organization || '[Organization Name]';
  const senderEmail = accountData?.email || '[Email Address]';
  const senderPhone = accountData?.phone || '[Phone Number]';
  
  let senderAddress = '';
  if (accountData?.address || accountData?.city) {
    const addressParts = [];
    if (accountData?.address) addressParts.push(accountData.address);
    if (accountData?.city && accountData?.state && accountData?.zipCode) {
      addressParts.push(`${accountData.city}, ${accountData.state} ${accountData.zipCode}`);
    } else if (accountData?.city) {
      addressParts.push(accountData.city);
    }
    if (accountData?.country) addressParts.push(accountData.country);
    if (addressParts.length > 0) {
      senderAddress = '\n' + addressParts.join('\n');
    }
  }

  const signatureBlock = accountData?.signature || `Sincerely,

${senderName}
${senderTitle}
${senderOrg}
${senderEmail}
${senderPhone}${senderAddress}`;

  // Generate different content based on template type
  if (template.title === 'Sick Leave Application') {
    return `${senderName}
${senderTitle}${senderOrg ? '\n' + senderOrg : ''}
${senderEmail}
${senderPhone}

${date}

To: [Recipient Name]
[Recipient Title]
[Organization Name]

Subject: Application for Sick Leave

Dear [Recipient Name],

I am writing to formally request sick leave due to health concerns. ${userInput}

I have attached the necessary medical documentation to support my request. I will ensure that all pending work is completed or delegated appropriately during my absence.

Thank you for your understanding and consideration of this matter. I look forward to returning to my duties as soon as possible.
${complianceNote}

${signatureBlock}`;
  } else if (template.title === 'Scholarship Application') {
    return `${senderName}
${senderEmail}
${senderPhone}

${date}

To: Scholarship Committee
[Institution Name]

Subject: Application for Academic Scholarship

Dear Committee Members,

I am writing to express my strong interest in applying for the academic scholarship offered by your esteemed institution. ${userInput}

My academic record demonstrates consistent excellence, and this scholarship would enable me to continue pursuing my educational goals without financial constraints. I am committed to maintaining high academic standards and contributing positively to the institution's community.
${complianceNote}

I appreciate your consideration of my application and look forward to the opportunity to discuss my qualifications further.

${signatureBlock}`;
  } else if (template.title === 'Business Proposal') {
    return `${senderName}
${senderTitle}
${senderOrg}
${senderEmail}
${senderPhone}${senderAddress}

${date}

To: [Recipient Name]
[Company Name]
[Address]

Subject: Business Collaboration Proposal

Dear [Recipient Name],

I am pleased to present this business proposal for your consideration. ${userInput}

We believe that a partnership between our organizations would create significant mutual value and drive innovation in our respective markets. Our proposal outlines a strategic framework that leverages the strengths of both parties.

Key benefits include:
• Enhanced market reach and customer engagement
• Shared resources and expertise
• Accelerated growth opportunities
${complianceNote}

We would welcome the opportunity to discuss this proposal in detail at your earliest convenience.

${signatureBlock}`;
  } else {
    // Generic template
    return `${senderName}
${senderTitle}${senderOrg ? '\n' + senderOrg : ''}
${senderEmail}
${senderPhone}

${date}

To: [Recipient Name]
[Recipient Title/Organization]

Subject: ${template.title}

Dear [Recipient Name],

I am writing regarding ${template.description.toLowerCase()}. ${userInput}

I believe this matter requires your attention and consideration. I am available to discuss this further and provide any additional information that may be needed.
${complianceNote}

Thank you for your time and consideration.

${signatureBlock}`;
  }
}