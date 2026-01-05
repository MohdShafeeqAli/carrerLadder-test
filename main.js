// ============================================
// 1. SETUP: Switch to the Classic SDK (Compatible with your code)
// ============================================
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// ⚠️ PASTE YOUR KEY HERE
const API_KEY = "AIzaSyDJTQSKdhWA-7Pg-OcUxdOL-VwbiXI_CY0";
const ai = new GoogleGenerativeAI(API_KEY);

// Conversation Memory
let conversationHistory = [];

// ============================================
// 2. YOUR DATA (The Grounding Layer)
// ============================================
// I am keeping your database exactly as it is. 
// The AI will read this to get its "Rules".
// Career database with rule-based matching logic
const careerDatabase = {
    // Science + Analytical combinations
    'Science-Analytical-10th': [
        {
            title: 'Engineering',
            description: 'Pursue a career in engineering by focusing on Physics, Chemistry, and Mathematics. Engineering offers diverse fields like Mechanical, Electrical, Civil, and Computer Engineering with excellent career prospects.',
            skills: ['Mathematics', 'Physics', 'Problem-solving', 'Analytical thinking'],
            nextStep: 'Focus on excelling in Physics, Chemistry, and Mathematics in 11th-12th grade. Prepare for JEE or state engineering entrance exams.'
        },
        {
            title: 'Medical Sciences',
            description: 'Aim for medical or allied health sciences. Focus on Biology, Chemistry, and Physics. Careers include Medicine, Dentistry, Pharmacy, or Biomedical Research with opportunities to make a significant impact.',
            skills: ['Biology', 'Chemistry', 'Critical thinking', 'Attention to detail'],
            nextStep: 'Excel in Biology, Chemistry, and Physics. Start preparing for NEET or other medical entrance exams in 11th-12th grade.'
        },
        {
            title: 'Pure Sciences',
            description: 'Consider advanced studies in Physics, Chemistry, or Mathematics. These fields lead to research careers, teaching positions, or roles in scientific organizations and laboratories.',
            skills: ['Scientific reasoning', 'Research methodology', 'Mathematical analysis', 'Experimental design'],
            nextStep: 'Choose Science stream with your preferred subject (Physics, Chemistry, or Mathematics). Participate in science fairs and Olympiads.'
        }
    ],
    'Science-Analytical-12th': [
        {
            title: 'Engineering Specialization',
            description: 'Choose specialized engineering fields like Aerospace, Biomedical, or Environmental Engineering. Your analytical skills combined with science background make you ideal for technical problem-solving roles.',
            skills: ['Advanced Mathematics', 'Engineering principles', 'Technical analysis', 'System design'],
            nextStep: 'Appear for JEE Advanced or state engineering exams. Research different engineering branches and choose based on your interest.'
        },
        {
            title: 'Medical Research',
            description: 'Pursue MBBS, BDS, or research-oriented programs in Biotechnology. Your analytical approach suits clinical research, medical diagnostics, or pharmaceutical development careers.',
            skills: ['Medical knowledge', 'Research methodology', 'Data analysis', 'Scientific writing'],
            nextStep: 'Prepare for NEET for MBBS/BDS or apply for Biotechnology programs. Consider research internships during college.'
        },
        {
            title: 'Data Science & Analytics',
            description: 'Combine your science background with analytical skills in Data Science. This emerging field offers opportunities in healthcare analytics, scientific computing, and research data management.',
            skills: ['Statistics', 'Programming (Python/R)', 'Data visualization', 'Machine learning basics'],
            nextStep: 'Enroll in a Data Science or Statistics undergraduate program. Start learning Python programming online.'
        }
    ],
    'Science-Analytical-Undergraduate': [
        {
            title: 'Research Scientist',
            description: 'Pursue advanced research in your field of specialization. With your analytical mindset and science background, you can contribute to groundbreaking discoveries in academia or industry.',
            skills: ['Research methodology', 'Statistical analysis', 'Scientific writing', 'Laboratory techniques'],
            nextStep: 'Pursue a Master\'s degree or PhD in your specialization. Apply for research positions or internships at universities and research institutions.'
        },
        {
            title: 'Engineering Consultant',
            description: 'Apply your technical expertise as a consultant solving complex engineering problems. Your analytical skills are valuable in design, optimization, and technical advisory roles.',
            skills: ['Engineering expertise', 'Problem-solving', 'Project management', 'Client communication'],
            nextStep: 'Gain 2-3 years of industry experience. Consider certifications in your engineering specialization. Build a portfolio of successful projects.'
        },
        {
            title: 'Biomedical Engineer',
            description: 'Bridge the gap between medicine and engineering. Develop medical devices, diagnostic tools, or work in healthcare technology innovation combining your science knowledge with analytical problem-solving.',
            skills: ['Biomedical systems', 'Medical device design', 'Regulatory knowledge', 'Interdisciplinary collaboration'],
            nextStep: 'Complete a Master\'s in Biomedical Engineering or related field. Gain experience through internships at medical device companies or hospitals.'
        }
    ],
    // Science + Creative combinations
    'Science-Creative-10th': [
        {
            title: 'Architecture',
            description: 'Combine scientific knowledge with creative design in architecture. This field requires understanding of physics and mathematics while allowing artistic expression in building design.'
        },
        {
            title: 'Industrial Design',
            description: 'Design products that are both functional and aesthetically pleasing. Your science background helps understand materials and processes while creativity drives innovation.'
        },
        {
            title: 'Scientific Illustration',
            description: 'Use artistic skills to visualize scientific concepts. Create educational materials, medical illustrations, or work in scientific communication and visualization.'
        }
    ],
    'Science-Creative-12th': [
        {
            title: 'Biomedical Design',
            description: 'Design medical devices, prosthetics, or healthcare solutions. Your creative approach combined with science knowledge enables innovative solutions for healthcare challenges.'
        },
        {
            title: 'Environmental Design',
            description: 'Create sustainable solutions for environmental challenges. Combine scientific understanding with creative problem-solving in urban planning, landscape architecture, or green technology.'
        },
        {
            title: 'Science Communication',
            description: 'Bridge science and the public through creative storytelling. Work in science journalism, educational content creation, or science-based media production.'
        }
    ],
    'Science-Creative-Undergraduate': [
        {
            title: 'Innovation Consultant',
            description: 'Lead innovation in science-based industries. Your creative problem-solving combined with scientific knowledge makes you valuable in R&D, product development, and innovation management.'
        },
        {
            title: 'UX Research in Health Tech',
            description: 'Design user experiences for healthcare and scientific applications. Combine your understanding of science with creative design thinking to improve healthcare technology.'
        },
        {
            title: 'Science-Based Entrepreneurship',
            description: 'Start ventures that combine scientific innovation with creative business solutions. Your unique combination of skills is ideal for biotech startups or science-based product companies.'
        }
    ],
    // Science + Communication combinations
    'Science-Communication-10th': [
        {
            title: 'Science Teacher',
            description: 'Inspire the next generation by teaching science. Your communication skills help make complex concepts accessible, while your science background provides the necessary expertise.'
        },
        {
            title: 'Science Writer',
            description: 'Communicate scientific discoveries to the public. Write articles, blogs, or educational content that makes science understandable and engaging for general audiences.'
        },
        {
            title: 'Laboratory Technician',
            description: 'Work in laboratories while communicating findings to researchers and teams. Your communication skills help bridge technical work with collaborative research environments.'
        }
    ],
    'Science-Communication-12th': [
        {
            title: 'Science Journalism',
            description: 'Report on scientific developments for media outlets. Your communication skills combined with science knowledge enable accurate and engaging science reporting.'
        },
        {
            title: 'Medical Sales Representative',
            description: 'Communicate the value of medical and pharmaceutical products to healthcare professionals. Your science background helps explain technical details effectively.'
        },
        {
            title: 'Science Education Specialist',
            description: 'Develop educational programs and materials for science learning. Create curricula, training programs, or work in science museums and educational institutions.'
        }
    ],
    'Science-Communication-Undergraduate': [
        {
            title: 'Science Policy Advisor',
            description: 'Bridge science and policy by communicating research findings to policymakers. Help translate scientific evidence into actionable policies and regulations.'
        },
        {
            title: 'Clinical Research Coordinator',
            description: 'Coordinate research studies while communicating with participants, researchers, and regulatory bodies. Your communication skills are essential for managing complex research projects.'
        },
        {
            title: 'Technical Writer (Science)',
            description: 'Create technical documentation, research papers, or scientific reports. Your ability to communicate complex scientific information clearly is valuable in research and industry.'
        }
    ],
    // Science + Practical combinations
    'Science-Practical-10th': [
        {
            title: 'Laboratory Assistant',
            description: 'Work hands-on in laboratories conducting experiments and tests. Your practical approach combined with science knowledge makes you effective in operational lab roles.'
        },
        {
            title: 'Pharmacy Technician',
            description: 'Assist pharmacists in preparing and dispensing medications. Your practical skills help in managing pharmacy operations while your science background ensures accuracy.'
        },
        {
            title: 'Medical Assistant',
            description: 'Support healthcare professionals in clinical settings. Your practical approach helps in patient care, while your science knowledge aids in understanding medical procedures.'
        }
    ],
    'Science-Practical-12th': [
        {
            title: 'Biotechnology Technician',
            description: 'Work in biotech labs conducting practical research and production. Your hands-on approach combined with science knowledge is valuable in manufacturing and quality control.'
        },
        {
            title: 'Radiology Technician',
            description: 'Operate medical imaging equipment and assist in diagnostic procedures. Your practical skills help in equipment operation while science knowledge ensures proper technique.'
        },
        {
            title: 'Environmental Technician',
            description: 'Conduct field work and lab analysis for environmental monitoring. Your practical approach helps in data collection and analysis for environmental protection.'
        }
    ],
    'Science-Practical-Undergraduate': [
        {
            title: 'Quality Assurance Specialist',
            description: 'Ensure quality and compliance in science-based industries. Your practical approach helps in implementing and monitoring quality systems in pharmaceutical, food, or manufacturing sectors.'
        },
        {
            title: 'Clinical Laboratory Scientist',
            description: 'Perform complex laboratory tests and analyze results. Your practical skills combined with scientific expertise make you essential in diagnostic and research laboratories.'
        },
        {
            title: 'Production Manager (Science Industry)',
            description: 'Oversee production processes in pharmaceutical or biotech companies. Your practical approach helps manage operations while your science background ensures technical understanding.'
        }
    ],
    // Arts + Analytical combinations
    'Arts-Analytical-10th': [
        {
            title: 'Economics',
            description: 'Study economics to analyze markets, policies, and social systems. Your analytical skills combined with arts background enable you to understand complex social and economic patterns.'
        },
        {
            title: 'Psychology',
            description: 'Explore human behavior through analytical research. Psychology combines arts understanding with scientific analysis, leading to careers in counseling, research, or human resources.'
        },
        {
            title: 'Political Science',
            description: 'Analyze political systems, policies, and governance. Your analytical approach helps understand political dynamics, leading to careers in policy analysis, research, or public service.'
        }
    ],
    'Arts-Analytical-12th': [
        {
            title: 'Data Analyst (Social Sciences)',
            description: 'Apply analytical skills to social science data. Analyze trends in society, culture, or economics. Your arts background provides context while analytical skills enable data-driven insights.'
        },
        {
            title: 'Market Research Analyst',
            description: 'Analyze consumer behavior and market trends. Your understanding of arts and culture combined with analytical skills helps identify patterns in consumer preferences and market dynamics.'
        },
        {
            title: 'Policy Analyst',
            description: 'Evaluate policies and their impacts on society. Your analytical approach helps assess policy effectiveness, while your arts background provides understanding of social contexts.'
        }
    ],
    'Arts-Analytical-Undergraduate': [
        {
            title: 'Behavioral Economist',
            description: 'Study how psychological, social, and emotional factors affect economic decisions. Your analytical skills combined with arts understanding make you ideal for this interdisciplinary field.'
        },
        {
            title: 'Social Research Scientist',
            description: 'Conduct research on social phenomena using analytical methods. Your arts background provides theoretical understanding while analytical skills enable rigorous research design.'
        },
        {
            title: 'Strategic Consultant',
            description: 'Help organizations make strategic decisions by analyzing market trends, consumer behavior, and competitive landscapes. Your analytical skills combined with cultural understanding are valuable assets.'
        }
    ],
    // Arts + Creative combinations
    'Arts-Creative-10th': [
        {
            title: 'Graphic Design',
            description: 'Create visual communications using design principles. Your creative skills combined with arts background enable you to produce compelling visual designs for various media.'
        },
        {
            title: 'Creative Writing',
            description: 'Pursue writing in various forms - novels, scripts, poetry, or content creation. Your creative expression combined with arts knowledge helps you craft engaging narratives.'
        },
        {
            title: 'Fine Arts',
            description: 'Develop your artistic skills in painting, sculpture, or digital art. Your creative abilities can lead to careers as a professional artist, art teacher, or creative director.'
        }
    ],
    'Arts-Creative-12th': [
        {
            title: 'Advertising & Marketing',
            description: 'Create compelling campaigns that connect with audiences. Your creative skills help develop engaging content while your arts background provides cultural understanding.',
            skills: ['Creative writing', 'Visual design', 'Consumer psychology', 'Campaign strategy'],
            nextStep: 'Pursue Mass Communication, Advertising, or Marketing degree. Build a portfolio with creative campaigns. Intern at advertising agencies.'
        },
        {
            title: 'Film & Media Production',
            description: 'Work in film, television, or digital media production. Your creative vision combined with arts knowledge helps you tell stories that resonate with audiences.',
            skills: ['Storytelling', 'Video editing', 'Cinematography', 'Production management'],
            nextStep: 'Enroll in Film Studies or Media Production program. Learn video editing software (Premiere Pro, Final Cut). Create short films for your portfolio.'
        },
        {
            title: 'Fashion Design',
            description: 'Design clothing and accessories combining creativity with cultural understanding. Your arts background helps you understand trends and cultural contexts in fashion.',
            skills: ['Fashion sketching', 'Textile knowledge', 'Trend analysis', 'Pattern making'],
            nextStep: 'Pursue Fashion Design degree or diploma. Learn fashion illustration and sewing. Build a portfolio with your designs.'
        }
    ],
    'Arts-Creative-Undergraduate': [
        {
            title: 'Creative Director',
            description: 'Lead creative teams in advertising, media, or design agencies. Your creative vision combined with arts knowledge helps you guide projects that connect with audiences.'
        },
        {
            title: 'Content Strategist',
            description: 'Develop content strategies that engage audiences across platforms. Your creative skills help produce compelling content while your arts background provides cultural insights.'
        },
        {
            title: 'Cultural Curator',
            description: 'Curate exhibitions, events, or cultural programs. Your creative vision combined with arts expertise helps you create meaningful cultural experiences for diverse audiences.'
        }
    ],
    // Arts + Communication combinations
    'Arts-Communication-10th': [
        {
            title: 'Journalism',
            description: 'Report news and tell stories that inform the public. Your communication skills combined with arts background help you understand and convey complex social and cultural issues.'
        },
        {
            title: 'Public Relations',
            description: 'Manage communication between organizations and the public. Your communication skills help craft messages while your arts background provides cultural awareness.'
        },
        {
            title: 'Teaching (Arts)',
            description: 'Educate students in arts subjects like literature, history, or social studies. Your communication skills help make complex topics accessible and engaging.'
        }
    ],
    'Arts-Communication-12th': [
        {
            title: 'Media & Communications',
            description: 'Work in media production, broadcasting, or digital communications. Your communication skills help create engaging content while your arts background provides cultural context.'
        },
        {
            title: 'Event Management',
            description: 'Plan and execute events that bring people together. Your communication skills help coordinate with stakeholders while your arts background helps create memorable experiences.'
        },
        {
            title: 'Social Media Management',
            description: 'Manage social media presence for brands or organizations. Your communication skills help craft engaging content while your arts background provides cultural understanding.'
        }
    ],
    'Arts-Communication-Undergraduate': [
        {
            title: 'Communications Director',
            description: 'Lead communication strategies for organizations. Your communication skills combined with arts knowledge help you craft messages that resonate with diverse audiences.'
        },
        {
            title: 'Cultural Program Manager',
            description: 'Develop and manage cultural programs, festivals, or community initiatives. Your communication skills help engage communities while your arts background provides cultural expertise.'
        },
        {
            title: 'Editorial Director',
            description: 'Oversee editorial content for publications or media outlets. Your communication skills help guide content creation while your arts background ensures quality and cultural sensitivity.'
        }
    ],
    // Arts + Practical combinations
    'Arts-Practical-10th': [
        {
            title: 'Event Coordinator',
            description: 'Organize and manage events from planning to execution. Your practical skills help manage logistics while your arts background helps create engaging experiences.'
        },
        {
            title: 'Retail Management',
            description: 'Manage retail operations in arts-related businesses like bookstores, galleries, or cultural centers. Your practical approach helps operations while arts knowledge aids customer service.'
        },
        {
            title: 'Administrative Support (Arts)',
            description: 'Provide administrative support in arts organizations, schools, or cultural institutions. Your practical skills help operations while your arts background provides context.'
        }
    ],
    'Arts-Practical-12th': [
        {
            title: 'Arts Administration',
            description: 'Manage operations of arts organizations, galleries, or cultural institutions. Your practical skills help with day-to-day management while your arts background provides understanding of the field.'
        },
        {
            title: 'Museum Technician',
            description: 'Handle practical aspects of museum operations including collections management, exhibitions, and visitor services. Your practical approach helps maintain operations while arts knowledge ensures proper care.'
        },
        {
            title: 'Cultural Tourism Coordinator',
            description: 'Develop and manage cultural tourism programs. Your practical skills help organize tours and events while your arts background provides cultural expertise.'
        }
    ],
    'Arts-Practical-Undergraduate': [
        {
            title: 'Arts Organization Manager',
            description: 'Lead operations of arts organizations, ensuring both artistic integrity and practical sustainability. Your practical skills help manage resources while your arts background guides programming.'
        },
        {
            title: 'Cultural Heritage Manager',
            description: 'Preserve and manage cultural heritage sites and collections. Your practical skills help with preservation and operations while your arts background ensures cultural sensitivity.'
        },
        {
            title: 'Community Arts Coordinator',
            description: 'Develop and manage community arts programs. Your practical approach helps organize programs while your arts background ensures meaningful cultural engagement.'
        }
    ],
    // Commerce + Analytical combinations
    'Commerce-Analytical-10th': [
        {
            title: 'Chartered Accountancy',
            description: 'Pursue CA to become a financial expert. Your analytical skills combined with commerce background make you ideal for accounting, auditing, and financial analysis roles.'
        },
        {
            title: 'Business Analytics',
            description: 'Analyze business data to drive decisions. Your analytical approach combined with commerce knowledge helps identify trends, optimize operations, and improve business performance.'
        },
        {
            title: 'Economics',
            description: 'Study economics to understand markets and economic systems. Your analytical skills help model economic behavior while commerce background provides practical business context.'
        }
    ],
    'Commerce-Analytical-12th': [
        {
            title: 'Financial Analyst',
            description: 'Analyze financial data to guide investment and business decisions. Your analytical skills combined with commerce expertise make you valuable in banking, investment, or corporate finance.',
            skills: ['Financial analysis', 'Excel/Financial modeling', 'Data interpretation', 'Market research'],
            nextStep: 'Pursue B.Com, BBA (Finance), or Economics. Learn Excel and financial modeling. Consider CFA certification after graduation.'
        },
        {
            title: 'Actuarial Science',
            description: 'Assess financial risks using mathematical and statistical methods. Your analytical approach combined with commerce knowledge is essential for insurance, pensions, and risk management.',
            skills: ['Mathematics', 'Statistics', 'Probability', 'Risk assessment'],
            nextStep: 'Enroll in Actuarial Science program. Start preparing for actuarial exams (ACET in India). Focus on Mathematics and Statistics.'
        },
        {
            title: 'Investment Banking',
            description: 'Help companies raise capital and make strategic financial decisions. Your analytical skills help evaluate deals while commerce background provides understanding of business finance.',
            skills: ['Financial modeling', 'Valuation', 'Market analysis', 'Deal structuring'],
            nextStep: 'Pursue Finance or Economics degree from top universities. Build financial modeling skills. Prepare for investment banking internships.'
        }
    ],
    'Commerce-Analytical-Undergraduate': [
        {
            title: 'Management Consultant',
            description: 'Help organizations improve performance through data-driven analysis. Your analytical skills combined with commerce expertise enable you to identify opportunities and solve complex business problems.'
        },
        {
            title: 'Chief Financial Officer',
            description: 'Lead financial strategy for organizations. Your analytical approach helps make strategic financial decisions while commerce background provides comprehensive business understanding.'
        },
        {
            title: 'Quantitative Analyst',
            description: 'Use mathematical models to analyze financial markets and risks. Your analytical skills combined with commerce knowledge make you valuable in trading, risk management, or financial modeling.'
        }
    ],
    // Commerce + Creative combinations
    'Commerce-Creative-10th': [
        {
            title: 'Marketing',
            description: 'Create compelling marketing campaigns that drive business results. Your creative skills help develop engaging content while commerce background provides business understanding.'
        },
        {
            title: 'Business Design',
            description: 'Design business models and customer experiences. Your creative approach helps innovate while commerce knowledge ensures business viability.'
        },
        {
            title: 'Entrepreneurship',
            description: 'Start your own business combining creative ideas with commerce knowledge. Your creativity helps identify opportunities while commerce background provides business fundamentals.'
        }
    ],
    'Commerce-Creative-12th': [
        {
            title: 'Brand Management',
            description: 'Develop and manage brand identities and strategies. Your creative skills help create compelling brand stories while commerce background ensures business alignment.',
            skills: ['Brand strategy', 'Creative thinking', 'Market research', 'Communication'],
            nextStep: 'Pursue BBA (Marketing) or Mass Communication. Learn about branding and marketing. Intern at advertising or brand agencies.'
        },
        {
            title: 'Digital Marketing',
            description: 'Create and manage digital marketing campaigns across platforms. Your creativity helps produce engaging content while commerce knowledge ensures ROI and business results.',
            skills: ['Social media marketing', 'Content creation', 'SEO/SEM', 'Analytics'],
            nextStep: 'Enroll in Marketing or Digital Marketing program. Learn Google Ads and Facebook Ads. Get certified in digital marketing platforms.'
        },
        {
            title: 'Product Management',
            description: 'Guide product development from concept to market. Your creative vision helps innovate while commerce background ensures market viability and business success.',
            skills: ['Product strategy', 'Market analysis', 'User research', 'Project management'],
            nextStep: 'Pursue BBA or Business degree. Learn product management fundamentals. Build products or projects to demonstrate skills.'
        }
    ],
    'Commerce-Creative-Undergraduate': [
        {
            title: 'Innovation Strategist',
            description: 'Lead innovation initiatives in organizations. Your creative problem-solving combined with commerce expertise helps develop new business models and market opportunities.'
        },
        {
            title: 'Chief Marketing Officer',
            description: 'Lead marketing strategy for organizations. Your creative vision helps develop compelling campaigns while commerce background ensures alignment with business objectives.'
        },
        {
            title: 'Business Development Director',
            description: 'Identify and develop new business opportunities. Your creative approach helps find innovative solutions while commerce knowledge ensures strategic and financial viability.'
        }
    ],
    // Commerce + Communication combinations
    'Commerce-Communication-10th': [
        {
            title: 'Sales',
            description: 'Build relationships and communicate value to customers. Your communication skills help connect with clients while commerce background provides product and market knowledge.'
        },
        {
            title: 'Customer Service',
            description: 'Help customers and resolve issues. Your communication skills ensure positive experiences while commerce knowledge helps address business-related inquiries effectively.'
        },
        {
            title: 'Business Communication',
            description: 'Facilitate communication within and between organizations. Your communication skills help convey business information clearly while commerce background provides context.'
        }
    ],
    'Commerce-Communication-12th': [
        {
            title: 'Business Development',
            description: 'Build relationships and partnerships to grow business. Your communication skills help negotiate deals while commerce background provides business understanding.'
        },
        {
            title: 'Corporate Training',
            description: 'Train employees on business processes and skills. Your communication skills help make training effective while commerce knowledge ensures relevant content.'
        },
        {
            title: 'Public Relations (Corporate)',
            description: 'Manage corporate reputation and stakeholder communication. Your communication skills help craft messages while commerce background provides business context.'
        }
    ],
    'Commerce-Communication-Undergraduate': [
        {
            title: 'Business Relationship Manager',
            description: 'Manage key business relationships and partnerships. Your communication skills help build trust while commerce expertise enables strategic discussions and deal-making.'
        },
        {
            title: 'Corporate Communications Director',
            description: 'Lead communication strategies for organizations. Your communication skills help craft messages while commerce background ensures alignment with business objectives.'
        },
        {
            title: 'Sales Director',
            description: 'Lead sales teams and strategies. Your communication skills help motivate teams and connect with clients while commerce knowledge ensures effective sales processes.'
        }
    ],
    // Commerce + Practical combinations
    'Commerce-Practical-10th': [
        {
            title: 'Retail Management',
            description: 'Manage retail store operations. Your practical skills help with day-to-day management while commerce background provides business understanding.'
        },
        {
            title: 'Accounting Assistant',
            description: 'Support accounting operations with practical tasks. Your practical approach helps maintain records while commerce knowledge ensures accuracy.'
        },
        {
            title: 'Business Operations',
            description: 'Handle practical aspects of business operations. Your practical skills help manage processes while commerce background provides business context.'
        }
    ],
    'Commerce-Practical-12th': [
        {
            title: 'Operations Manager',
            description: 'Oversee business operations and processes. Your practical approach helps optimize operations while commerce background provides business understanding.'
        },
        {
            title: 'Supply Chain Management',
            description: 'Manage supply chain operations from procurement to delivery. Your practical skills help coordinate logistics while commerce knowledge ensures efficiency.'
        },
        {
            title: 'Business Administration',
            description: 'Manage administrative and operational aspects of business. Your practical approach helps maintain smooth operations while commerce background provides business context.'
        }
    ],
    'Commerce-Practical-Undergraduate': [
        {
            title: 'Chief Operating Officer',
            description: 'Lead operations for organizations. Your practical approach helps optimize processes while commerce expertise ensures business efficiency and growth.'
        },
        {
            title: 'Operations Consultant',
            description: 'Help organizations improve operational efficiency. Your practical skills help identify improvements while commerce knowledge ensures business alignment.'
        },
        {
            title: 'Business Process Manager',
            description: 'Design and optimize business processes. Your practical approach helps implement improvements while commerce background ensures processes support business objectives.'
        }
    ],
    // Technology + Analytical combinations
    'Technology-Analytical-10th': [
        {
            title: 'Software Development',
            description: 'Build software applications and systems. Your analytical skills help solve complex programming problems while technology interest drives your learning in coding and development.',
            skills: ['Programming logic', 'Problem-solving', 'Mathematics', 'Logical thinking'],
            nextStep: 'Choose Computer Science or IT stream in 11th-12th. Start learning programming basics (Python recommended). Practice coding on platforms like Codecademy.'
        },
        {
            title: 'Data Science',
            description: 'Analyze data to extract insights and build predictive models. Your analytical approach combined with technology interest makes you ideal for this high-demand field.',
            skills: ['Mathematics', 'Statistics', 'Data analysis', 'Programming'],
            nextStep: 'Focus on Mathematics and Statistics in 11th-12th. Learn Python programming basics. Explore data analysis through online courses.'
        },
        {
            title: 'Cybersecurity',
            description: 'Protect systems and data from threats. Your analytical skills help identify vulnerabilities and design security solutions while technology knowledge provides the foundation.',
            skills: ['Network security', 'Problem-solving', 'Ethical hacking', 'System analysis'],
            nextStep: 'Study Computer Science or IT. Learn about networks and security basics. Consider cybersecurity certifications after 12th.'
        }
    ],
    'Technology-Analytical-12th': [
        {
            title: 'Software Engineer',
            description: 'Design and develop complex software systems. Your analytical skills help architect solutions while technology expertise enables implementation of scalable applications.',
            skills: ['Programming (Java/Python/C++)', 'Data structures & algorithms', 'System design', 'Problem-solving'],
            nextStep: 'Enroll in Computer Science or Software Engineering program. Start coding practice on platforms like LeetCode. Build personal projects.'
        },
        {
            title: 'Machine Learning Engineer',
            description: 'Build AI and machine learning systems. Your analytical approach helps design algorithms while technology skills enable implementation of intelligent systems.',
            skills: ['Python', 'Machine learning algorithms', 'Statistics', 'Data analysis'],
            nextStep: 'Pursue Computer Science with focus on AI/ML. Learn Python and ML libraries (TensorFlow, scikit-learn). Complete online ML courses.'
        },
        {
            title: 'Systems Architect',
            description: 'Design large-scale technology systems. Your analytical skills help plan system architecture while technology knowledge ensures robust and scalable solutions.',
            skills: ['System design', 'Cloud computing', 'Distributed systems', 'Architecture patterns'],
            nextStep: 'Study Computer Science or IT. Learn cloud platforms (AWS/Azure). Gain experience through internships and system design projects.'
        }
    ],
    'Technology-Analytical-Undergraduate': [
        {
            title: 'Senior Software Architect',
            description: 'Lead technical architecture for complex systems. Your analytical skills help design optimal solutions while technology expertise enables implementation of enterprise-scale systems.'
        },
        {
            title: 'AI Research Scientist',
            description: 'Conduct research in artificial intelligence and machine learning. Your analytical approach helps develop new algorithms while technology skills enable experimentation and implementation.'
        },
        {
            title: 'Technical Lead',
            description: 'Lead technical teams in developing innovative solutions. Your analytical skills help solve complex problems while technology expertise enables you to guide technical decisions.'
        }
    ],
    // Technology + Creative combinations
    'Technology-Creative-10th': [
        {
            title: 'Web Design',
            description: 'Create visually appealing and functional websites. Your creative skills help design engaging user interfaces while technology knowledge enables implementation.'
        },
        {
            title: 'Game Development',
            description: 'Design and develop video games. Your creativity helps create engaging gameplay and stories while technology skills enable game development.'
        },
        {
            title: 'UI/UX Design',
            description: 'Design user interfaces and experiences for digital products. Your creative vision helps create intuitive designs while technology understanding ensures feasibility.'
        }
    ],
    'Technology-Creative-12th': [
        {
            title: 'Frontend Development',
            description: 'Build user-facing applications with focus on design and user experience. Your creative skills help create engaging interfaces while technology expertise enables implementation.',
            skills: ['HTML/CSS', 'JavaScript', 'UI/UX design', 'Responsive design'],
            nextStep: 'Enroll in Computer Science or related program. Start building projects with HTML, CSS, and JavaScript. Create a portfolio website.'
        },
        {
            title: 'Digital Product Designer',
            description: 'Design digital products from concept to implementation. Your creativity helps innovate while technology knowledge ensures designs are technically feasible and user-friendly.',
            skills: ['Design thinking', 'UI/UX tools (Figma/Adobe XD)', 'User research', 'Prototyping'],
            nextStep: 'Learn design tools like Figma or Adobe XD. Study UX design principles. Build a design portfolio with case studies.'
        },
        {
            title: 'Creative Technologist',
            description: 'Combine technology with creative expression in interactive media, installations, or digital art. Your creative vision helps push boundaries while technology skills enable realization.',
            skills: ['Creative coding', 'Interactive design', 'Multimedia production', 'Technical creativity'],
            nextStep: 'Learn creative coding with Processing or p5.js. Explore interactive art and media programs. Build interactive projects for your portfolio.'
        }
    ],
    'Technology-Creative-Undergraduate': [
        {
            title: 'Product Design Lead',
            description: 'Lead design of technology products. Your creative vision helps innovate while technology expertise ensures products are both desirable and technically sound.'
        },
        {
            title: 'Innovation Director (Tech)',
            description: 'Lead innovation initiatives in technology companies. Your creative problem-solving combined with technology expertise helps develop breakthrough products and services.'
        },
        {
            title: 'Creative Director (Digital)',
            description: 'Lead creative vision for digital products and experiences. Your creativity helps create compelling experiences while technology knowledge ensures effective implementation.'
        }
    ],
    // Technology + Communication combinations
    'Technology-Communication-10th': [
        {
            title: 'Technical Writing',
            description: 'Create documentation and guides for technology products. Your communication skills help make complex technical information accessible while technology knowledge ensures accuracy.'
        },
        {
            title: 'IT Support',
            description: 'Help users with technology issues. Your communication skills help explain solutions clearly while technology knowledge enables effective troubleshooting.'
        },
        {
            title: 'Technology Training',
            description: 'Train people on using technology tools and systems. Your communication skills help make training effective while technology knowledge ensures comprehensive coverage.'
        }
    ],
    'Technology-Communication-12th': [
        {
            title: 'Technical Sales Engineer',
            description: 'Sell technology solutions by communicating technical value to customers. Your communication skills help explain benefits while technology knowledge enables detailed discussions.'
        },
        {
            title: 'Developer Relations',
            description: 'Build relationships with developer communities. Your communication skills help engage developers while technology knowledge enables meaningful technical discussions.'
        },
        {
            title: 'Technology Journalism',
            description: 'Report on technology trends and products. Your communication skills help make complex topics accessible while technology knowledge ensures accurate reporting.'
        }
    ],
    'Technology-Communication-Undergraduate': [
        {
            title: 'Product Marketing Manager (Tech)',
            description: 'Market technology products by communicating value to customers. Your communication skills help craft compelling messages while technology knowledge ensures accurate positioning.'
        },
        {
            title: 'Chief Technology Officer',
            description: 'Lead technology strategy and communicate it to stakeholders. Your communication skills help align technology with business while technology expertise enables strategic decisions.'
        },
        {
            title: 'Technology Evangelist',
            description: 'Promote technology adoption through speaking, writing, and community engagement. Your communication skills help inspire while technology knowledge provides credibility.'
        }
    ],
    // Technology + Practical combinations
    'Technology-Practical-10th': [
        {
            title: 'IT Support Technician',
            description: 'Provide hands-on technical support and troubleshooting. Your practical skills help resolve issues quickly while technology knowledge enables effective problem-solving.'
        },
        {
            title: 'Network Administrator',
            description: 'Manage and maintain computer networks. Your practical approach helps with day-to-day operations while technology knowledge ensures reliable network infrastructure.'
        },
        {
            title: 'Hardware Technician',
            description: 'Install, maintain, and repair computer hardware. Your practical skills help with hands-on work while technology knowledge ensures proper diagnosis and repair.'
        }
    ],
    'Technology-Practical-12th': [
        {
            title: 'DevOps Engineer',
            description: 'Manage deployment and operations of software systems. Your practical approach helps automate processes while technology knowledge ensures reliable and scalable operations.'
        },
        {
            title: 'Systems Administrator',
            description: 'Manage IT infrastructure and systems. Your practical skills help maintain operations while technology knowledge ensures optimal system performance and security.'
        },
        {
            title: 'Cloud Infrastructure Engineer',
            description: 'Design and manage cloud-based infrastructure. Your practical approach helps optimize operations while technology knowledge ensures scalable and cost-effective solutions.'
        }
    ],
    'Technology-Practical-Undergraduate': [
        {
            title: 'Infrastructure Architect',
            description: 'Design and manage large-scale IT infrastructure. Your practical approach helps optimize operations while technology expertise ensures robust, scalable, and efficient systems.'
        },
        {
            title: 'Site Reliability Engineer',
            description: 'Ensure reliability and performance of technology systems. Your practical skills help maintain operations while technology knowledge enables proactive problem-solving.'
        },
        {
            title: 'IT Operations Director',
            description: 'Lead IT operations for organizations. Your practical approach helps optimize processes while technology expertise ensures reliable and efficient technology infrastructure.'
        }
    ]
};

// ============================================
// 3. THE "THINKING" CHAT ENGINE
// ============================================
window.handleChat = async function () {
    const inputField = document.getElementById("chatInput");
    const sendButton = document.getElementById("sendBtn");
    const userText = inputField.value.trim();

    // 1. Safety Checks
    if (!userText) return;

    // 2. UI: Show User Message
    addMessageToUI(userText, "user");
    inputField.value = "";
    sendButton.disabled = true;
    const typingId = showTypingIndicator();

    try {
        // -------------------------------------------------------
        // STEP A: THE SPARK (Scanning your Database)
        // -------------------------------------------------------
        let ruleSpark = "";

        // Simple keyword matching to find relevant database entries
        // e.g., if user says "Science", we grab Science rules.
        const keywords = userText.toLowerCase().split(" ");
        for (const key in careerDatabase) {
            for (const word of keywords) {
                if (key.toLowerCase().includes(word) && word.length > 3) {
                    // Found a match! Add it to the context.
                    const entries = careerDatabase[key].map(e => e.title).join(", ");
                    ruleSpark += `[FOUND RULE]: For '${key}', suggest: ${entries}. \n`;
                }
            }
        }

        if (ruleSpark === "") {
            ruleSpark = "No exact database match. Use general career knowledge (2026 trends).";
        }

        // -------------------------------------------------------
        // STEP B: THE "THINKING" PROMPT
        // -------------------------------------------------------
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemInstruction = `
            You are a Career Strategist (Year 2026).
            
            === YOUR KNOWLEDGE BASE ===
            ${ruleSpark}
            ===========================

            INSTRUCTIONS:
            1. If the [FOUND RULE] applies, use it as your baseline.
            2. THINK: Don't just list jobs. Analyze the "Scope" and "Future Trends" (AI, Automation).
            3. If the user's input is vague (e.g., "I like Science"), ask a clarifying question (e.g., "Research or Applied?").
            4. Keep answers short (max 3 sentences) and encouraging.
        `;

        // Start or Continue Chat
        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "Understood. I will combine the database rules with 2026 market trends." }] },
                ...conversationHistory
            ]
        });

        const result = await chat.sendMessage(userText);
        const responseText = result.response.text();

        // Save history
        conversationHistory.push({ role: "user", parts: [{ text: userText }] });
        conversationHistory.push({ role: "model", parts: [{ text: responseText }] });

        // 3. UI: Show AI Message
        removeTypingIndicator(typingId);
        addMessageToUI(responseText, "bot");

    } catch (error) {
        console.error("AI Error:", error);
        removeTypingIndicator(typingId);
        addMessageToUI("⚠️ Connection lost. Please try again.", "bot");
    } finally {
        sendButton.disabled = false;
        inputField.focus();
    }
};

// ============================================
// 4. UI HELPER FUNCTIONS
// ============================================
function addMessageToUI(text, sender) {
    const historyDiv = document.getElementById("chat-history");
    const msgDiv = document.createElement("div");

    // Convert newlines to breaks for readability
    const formattedText = text.replace(/\n/g, "<br>");

    if (sender === "user") {
        msgDiv.className = "chat-bubble user";
        msgDiv.innerHTML = formattedText;
    } else {
        msgDiv.className = "chat-bubble ai";
        // Check for specific keywords to add formatting
        if (text.includes("Scope") || text.includes("Trend")) {
            msgDiv.style.borderLeft = "4px solid #2563eb"; // Blue accent for "Thinking" answers
        }
        msgDiv.innerHTML = formattedText;
    }

    historyDiv.appendChild(msgDiv);
    historyDiv.scrollTop = historyDiv.scrollHeight;
}

function showTypingIndicator() {
    const historyDiv = document.getElementById("chat-history");
    const id = "typing-" + Date.now();
    const div = document.createElement("div");
    div.id = id;
    div.className = "chat-bubble ai";
    div.style.fontStyle = "italic";
    div.style.color = "#6b7280";
    div.innerText = "Thinking...";
    historyDiv.appendChild(div);
    historyDiv.scrollTop = historyDiv.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// ============================================
// 5. EVENT LISTENERS
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    const sendBtn = document.getElementById("sendBtn");
    const chatInput = document.getElementById("chatInput");

    // Add initial greeting
    setTimeout(() => {
        addMessageToUI("Hello! I am your AI Career Mentor. Tell me what you are interested in (e.g., 'I love coding' or 'I want to be a Doctor').", "bot");
    }, 500);

    if (sendBtn) {
        sendBtn.addEventListener("click", window.handleChat);
    }

    if (chatInput) {
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") window.handleChat();
        });
    }
});