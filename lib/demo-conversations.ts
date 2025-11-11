export interface DemoConversation {
  title: string
  messages: {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
  }[]
}

// Use a fixed base time to avoid hydration issues
const BASE_TIME = new Date("2025-11-11T10:00:00").getTime()
export const demoConversations: DemoConversation[] = [
  {
    title: "Customer churn analysis Q4",
    messages: [
      {
        id: "1",
        role: "user",
        content: "Show me customers at risk of churning",
        timestamp: new Date(BASE_TIME - 3600000),
      },
      {
        id: "2",
        role: "assistant",
        content:
          "CHURN RISK ANALYSIS\n\nCurrently tracking 3 at-risk customers representing $12.6K MRR.\n\nCRITICAL ATTENTION NEEDED:\n\n1. Legal Partners LLP\n   Churn Risk: 85%\n   Health Score: 48/100\n   MRR: $3,400\n   Days Since Last Activity: 27 days (October 15)\n   Open Support Tickets: 12\n   Primary Issues: Dashboard loading failures, billing discrepancies, low platform engagement (22 of 95 potential users active)\n\n2. HealthPlus Medical\n   Churn Risk: 72%\n   Health Score: 54/100\n   MRR: $4,200\n   Days Since Last Activity: 14 days (October 28)\n   Open Support Tickets: 8\n   Primary Issues: HIPAA integration challenges, slow API response times, feature adoption at 31%\n\n3. StartupGrow\n   Churn Risk: 45%\n   Health Score: 68/100\n   MRR: $890\n   Days Since Last Activity: 0 days (Active today)\n   Open Support Tickets: 4\n   Primary Issues: Training needs, underutilized features, onboarding incomplete\n\nRECOMMENDED ACTIONS:\n• Schedule executive business reviews with Legal Partners LLP and HealthPlus Medical within 48 hours\n• Conduct feature adoption analysis to identify training gaps\n• Expedite resolution of critical support tickets (target: 24-48 hour resolution)\n• Assign dedicated CSM for high-risk accounts to improve engagement",
        timestamp: new Date(BASE_TIME - 3598000),
      },
      {
        id: "3",
        role: "user",
        content: "What's the main issue with Legal Partners?",
        timestamp: new Date(BASE_TIME - 3500000),
      },
      {
        id: "4",
        role: "assistant",
        content:
          "LEGAL PARTNERS LLP - DETAILED ACCOUNT ANALYSIS\n\nBased on their account data, this account is showing multiple compounding issues requiring immediate intervention.\n\nPRIMARY ISSUES:\n\n1. Dashboard Loading Bug (CRITICAL - Reported Nov 10)\n   Status: Unresolved\n   Impact: Prevents access to core reporting features\n   User Affected: 85 concurrent users blocked\n   Support Ticket: LP-2024-1156\n\n2. Billing Discrepancy (HIGH - Reported Nov 11)\n   Status: Under investigation\n   Amount in Question: $1,200 (September invoice)\n   Customer Sentiment: Frustrated, questioning ROI\n   Support Ticket: LP-2024-1157\n\n3. Platform Engagement Decline\n   Daily Active Users: 22 (down from 95 baseline)\n   Decline Timeline: Started late September, accelerated in October\n   Feature Adoption Rate: 38% (target: 65%+)\n   Last Significant Activity: October 15 - 27 days ago\n\n4. Support Experience Issues\n   Average Response Time: 12.5 hours (vs 3.8 hour target)\n   Backlog of Open Tickets: 12\n   Customer Escalation Risk: Very High\n\nROOT CAUSE ANALYSIS:\nThe dashboard bug appears to be the trigger event. Following the November 10 outage, engagement dropped significantly. Combined with billing concerns and delayed support responses, this has created a negative feedback loop.\n\nIMMEDIATE ACTIONS (Next 24 Hours):\n• Escalate dashboard bug to senior engineering for priority fix\n• Schedule call with account decision maker to address billing concern and demonstrate commitment\n• Resolve top 5 support tickets to clear backlog\n• Assign dedicated support resource for remainder of week\n\nSTRATEGIC ACTIONS (Next 7 Days):\n• Conduct feature adoption training session with their team\n• Develop customized ROI report showing value delivered\n• Review contract renewal terms and propose expanded features at no cost\n• Implement weekly check-ins to rebuild relationship",
        timestamp: new Date(BASE_TIME - 3495000),
      },
    ],
  },
  {
    title: "Support ticket trends",
    messages: [
      {
        id: "1",
        role: "user",
        content: "What are my critical support tickets?",
        timestamp: new Date(BASE_TIME - 7200000),
      },
      {
        id: "2",
        role: "assistant",
        content:
          "SUPPORT TICKET OVERVIEW\n\nCurrent Status:\n• Total Open Tickets: 5\n• Critical Priority: 2\n• High Priority: 3\n• Average First Response Time: 3.8 hours\n• Average Resolution Time: 18.2 hours\n\nCRITICAL PRIORITY TICKETS:\n\n1. HealthPlus Medical - Integration Issue (Ticket ID: HP-2024-1089)\n   Status: In Progress\n   Priority: Critical\n   Reported: November 10, 2025\n   Issue: HIPAA-compliant system integration failing intermittently\n   Assigned To: Maria Chen, Senior Technical Support\n   Impact: Prevents data synchronization, ~200 records queued\n   Target Resolution: November 12, 2025\n   Customer Sentiment: High urgency, considering alternative solutions\n\n2. Legal Partners LLP - Dashboard Loading (Ticket ID: LP-2024-1156)\n   Status: In Progress\n   Priority: Critical\n   Reported: November 10, 2025\n   Issue: Dashboard interface timing out, inaccessible for all users\n   Assigned To: Lisa Rodriguez, Technical Support Lead\n   Impact: Blocks access to reporting features, 85 users affected\n   Target Resolution: November 11, 2025\n   Customer Sentiment: Escalated, considering churn\n\nHIGH PRIORITY TICKETS:\n\n1. RetailMax Inc - Performance Degradation (Ticket ID: RM-2024-0987)\n   Status: Assigned\n   Reported: November 9, 2025\n   Issue: API response times degraded by 40%\n   Assigned To: James Morrison, Senior Technical Support\n\n2. CloudSync Technologies - Feature Request (Ticket ID: CS-2024-1045)\n   Status: Assigned\n   Reported: November 8, 2025\n   Issue: Custom reporting module needed for regulatory compliance\n   Assigned To: Alex Kumar, Solutions Engineer\n\n3. Manufacturing Pro - Data Export Issue (Ticket ID: MP-2024-0967)\n   Status: Waiting for Customer Response\n   Reported: November 7, 2025\n   Issue: CSV export functionality producing malformed data\n   Last Follow-up: November 10, 2025\n\nRECOMMENDATION:\nFocus immediate efforts on the two critical tickets from HealthPlus Medical and Legal Partners LLP. Both accounts are significant revenue contributors showing churn risk. Resolution of these issues is critical to account retention.",
        timestamp: new Date(BASE_TIME - 7195000),
      },
    ],
  },
  {
    title: "Account health dashboard",
    messages: [
      {
        id: "1",
        role: "user",
        content: "Give me an overview of customer health across all accounts",
        timestamp: new Date(BASE_TIME - 14400000),
      },
      {
        id: "2",
        role: "assistant",
        content:
          "OVERALL CUSTOMER HEALTH SUMMARY\n\nPortfolio Health Score: 77/100\nStatus: Good (stable)\n\nCUSTOMER SEGMENTATION:\n• Excellent Health (80-100): 5 customers\n• Good Health (60-79): 2 customers\n• At-Risk (Below 60): 3 customers\n• Total Customer Base: 10 key accounts tracked\n\nKEY METRICS:\n• Average Net Promoter Score: 74\n• Feature Adoption Rate: 76%\n• Support Satisfaction Score: 82/100\n• Contract Renewal Rate (YTD): 94%\n\nTOP PERFORMING ACCOUNTS:\n1. EduLearn Platform\n   Health Score: 95/100\n   Status: Exemplary\n   MRR: $1,200\n   Key Factor: High engagement, 98% feature adoption, strong NPS of 89\n\n2. TechCorp Solutions\n   Health Score: 92/100\n   Status: Exemplary\n   MRR: $12,500\n   Key Factor: Enterprise customer, 94% feature adoption, expanding use cases\n\n3. CloudSync Technologies\n   Health Score: 90/100\n   Status: Very Good\n   MRR: $22,000\n   Key Factor: Top revenue contributor, consistent engagement, actively exploring upsells\n\nAT-RISK ACCOUNTS:\n1. Legal Partners LLP (Health: 48/100)\n   Primary Concern: Engagement decline, support backlog, billing dispute\n   Action Required: Immediate intervention\n\n2. HealthPlus Medical (Health: 54/100)\n   Primary Concern: Integration challenges, slow platform adoption\n   Action Required: Technical support escalation\n\n3. StartupGrow (Health: 68/100)\n   Primary Concern: Incomplete onboarding, training needs\n   Action Required: Structured engagement program\n\nPORTFOLIO TREND:\nOverall health has remained stable over the past 30 days with slight improvement in the excellent health segment. The main concern is the recent deterioration in two previously stable accounts (Legal Partners and HealthPlus Medical), both triggered by technical issues.",
        timestamp: new Date(BASE_TIME - 14395000),
      },
      {
        id: "3",
        role: "user",
        content: "Yes, show me which industries are performing best",
        timestamp: new Date(BASE_TIME - 14300000),
      },
      {
        id: "4",
        role: "assistant",
        content:
          "INDUSTRY PERFORMANCE ANALYSIS\n\nTECHNOLOGY SECTOR\nTotal Customers: 245\nAverage MRR per Customer: $15,800\nPortfolio Health Score: 88/100\nChurn Risk: 8%\nFeature Adoption: 82%\nKey Insight: Highest growth segment with strong technical users who adopt features quickly. Low churn indicates good product-market fit.\n\nFINANCIAL SERVICES SECTOR\nTotal Customers: 182\nAverage MRR per Customer: $22,400\nPortfolio Health Score: 82/100\nChurn Risk: 12%\nFeature Adoption: 79%\nKey Insight: Highest ARPU customers with complex regulatory requirements. Health score reflects occasional integration challenges with legacy systems.\n\nHEALTHCARE SECTOR\nTotal Customers: 156\nAverage MRR per Customer: $12,200\nPortfolio Health Score: 76/100\nChurn Risk: 18%\nFeature Adoption: 71%\nKey Insight: Requires attention. HIPAA compliance demands create support burden. Needs specialized training and resources.\n\nRETAIL SECTOR\nTotal Customers: 198\nAverage MRR per Customer: $8,900\nPortfolio Health Score: 85/100\nChurn Risk: 10%\nFeature Adoption: 81%\nKey Insight: Strong performance from mid-market segment. Quick implementation cycles drive high feature adoption.\n\nMANUFACTURING SECTOR\nTotal Customers: 134\nAverage MRR per Customer: $18,600\nPortfolio Health Score: 80/100\nChurn Risk: 14%\nFeature Adoption: 74%\nKey Insight: Stable segment. Longer sales cycles offset with strong customer loyalty and expansion revenue.\n\nEDUCATION SECTOR\nTotal Customers: 89\nAverage MRR per Customer: $4,200\nPortfolio Health Score: 92/100\nChurn Risk: 5%\nFeature Adoption: 91%\nKey Insight: Highest satisfaction and lowest churn. Smaller deal size compensated by long contract terms and stable budgets.\n\nSTRATEGIC INSIGHTS:\n\n1. Education and Technology are top performers (92 and 88 health scores)\n   Action: Develop case studies and reference customers for sales enablement\n\n2. Financial Services commands highest ARPU ($22.4K) but faces integration challenges\n   Action: Build specialized FinServ onboarding program and technical resources\n\n3. Healthcare requires immediate attention (18% churn risk, 76 health score)\n   Action: Create healthcare-specific training materials and assign dedicated support team\n\n4. Retail and Manufacturing showing strong mid-market health\n   Action: Develop upsell packages targeting these well-performing segments\n\nRECOMMENDATION:\nInvest additional resources in healthcare segment to bring health score in line with other sectors. Simultaneously, capitalize on education and technology segments' strong performance by developing expansion programs for customers in these verticals.",
        timestamp: new Date(BASE_TIME - 14290000),
      },
    ],
  },
  {
    title: "Usage metrics review",
    messages: [
      {
        id: "1",
        role: "user",
        content: "How is our user engagement trending?",
        timestamp: new Date(BASE_TIME - 21600000),
      },
      {
        id: "2",
        role: "assistant",
        content:
          "USER ENGAGEMENT METRICS - LAST 30 DAYS\n\nENCORE METRICS:\n• Daily Active Users: 2,520 (↑5.8% vs previous month)\n• Weekly Active Users: 3,840 (↑4.2% vs previous month)\n• Monthly Active Users: 4,200\n• Average Session Duration: 24 minutes (↑2 min vs previous month)\n• API Calls Per Day: 125,840\n• API Success Rate: 99.7%\n\nFEATURE ADOPTION TRENDS:\n\n1. Analytics Dashboard\n   Adoption Rate: 92%\n   Active Users: 2,850 (of 3,096 account users)\n   Usage Frequency: 8.3x per week average\n   Trend: Stable, highest engagement feature\n\n2. Team Collaboration Tools\n   Adoption Rate: 88%\n   Active Users: 2,728\n   Usage Frequency: 6.1x per week average\n   Trend: Growing, +12% from last month\n\n3. API Integration\n   Adoption Rate: 85%\n   Active Users: 2,635\n   Usage Frequency: 4.2x per week average\n   Trend: Stable, consistent usage pattern\n\n4. Custom Reports\n   Adoption Rate: 71%\n   Active Users: 2,196\n   Usage Frequency: 3.4x per week average\n   Trend: Growing, +8% from last month\n\n5. Mobile App\n   Adoption Rate: 45%\n   Active Users: 1,389\n   Usage Frequency: 2.1x per week average\n   Trend: Growing but underperforming, +6% from last month\n\nPLATFORM USAGE PATTERNS:\n• Peak Usage: Tuesday-Thursday, 10am-2pm EST\n• Weekend Usage: 28% of weekday average\n• Morning Sessions (6am-12pm): 45% of daily traffic\n• Evening Sessions (6pm-11pm): 35% of daily traffic\n• Logged Off Time (11pm-6am): 20% of daily traffic (API only)\n\nSEGMENT ANALYSIS:\n• Enterprise Customers: 87% feature adoption rate\n• Mid-Market Customers: 74% feature adoption rate\n• Small Business Customers: 62% feature adoption rate\n\nGROWTH OPPORTUNITIES:\n\n1. Mobile App (45% adoption)\n   Gap Analysis: Missing 2,455 potential users\n   Recommendation: Launch mobile app awareness campaign, in-app onboarding improvements\n   Potential Impact: Could drive +20% in mobile engagement\n\n2. Custom Reports (71% adoption)\n   Gap Analysis: Missing 889 potential users\n   Recommendation: Create template library, host webinar series\n   Potential Impact: Could increase reporting feature usage by 15%\n\n3. Weekend Engagement (28% of weekday)\n   Gap Analysis: Opportunity to capture remote workers, global teams\n   Recommendation: Weekend-focused campaign, async collaboration features\n   Potential Impact: +10-15% overall engagement\n\nHEALTH CHECK:\n• Feature adoption at 76% average is healthy\n• Daily active user growth of 5.8% shows momentum\n• API reliability at 99.7% demonstrates platform stability\n• Session duration improvement indicates stickiness\n\nRECOMMENDATIONS:\n1. Prioritize mobile app improvement initiative\n2. Create feature tutorial content for underutilized features\n3. Develop weekend engagement strategy\n4. Implement push notifications for feature announcements",
        timestamp: new Date(BASE_TIME - 21595000),
      },
    ],
  },
  {
    title: "Revenue growth trends",
    messages: [
      {
        id: "1",
        role: "user",
        content: "Show me our revenue growth over the past 6 months",
        timestamp: new Date(BASE_TIME - 28800000),
      },
      {
        id: "2",
        role: "assistant",
        content:
          "REVENUE METRICS - 6 MONTH ANALYSIS\n\nCURRENT FINANCIAL POSITION:\n• Total Monthly Recurring Revenue (MRR): $89,500\n• Projected Annual Recurring Revenue (ARR): $1,074,000\n• Total Annual Revenue Run Rate: $1,127,640\n• Month-over-Month Growth: +$4,200 (+4.9%)\n\nTOP 5 REVENUE CONTRIBUTORS:\n\n1. CloudSync Technologies\n   MRR: $22,000\n   Segment: Enterprise\n   Growth (6-month): +$3,200 (+16.9%)\n   Contract Term: 2-year agreement expiring Q1 2026\n\n2. Global Finance Corp\n   MRR: $18,900\n   Segment: Enterprise\n   Growth (6-month): +$1,800 (+10.5%)\n   Contract Term: Annual, renews December 2025\n\n3. Manufacturing Pro\n   MRR: $15,600\n   Segment: Enterprise\n   Growth (6-month): +$2,100 (+15.5%)\n   Contract Term: Annual, renews March 2026\n\n4. TechCorp Solutions\n   MRR: $12,500\n   Segment: Enterprise\n   Growth (6-month): +$1,800 (+16.7%)\n   Contract Term: 2-year agreement expiring Q2 2026\n\n5. ConsumerGoods Plus\n   MRR: $6,200\n   Segment: Mid-Market\n   Growth (6-month): +$800 (+14.8%)\n   Contract Term: Annual, renews August 2026\n\nREVENUE GROWTH TRAJECTORY:\n\nMay 2025: $68,500 MRR\nJune 2025: $70,100 MRR (+2.3%)\nJuly 2025: $72,800 MRR (+3.8%)\nAugust 2025: $76,200 MRR (+4.7%)\nSeptember 2025: $81,400 MRR (+6.8%)\nOctober 2025: $85,300 MRR (+4.8%)\nNovember 2025: $89,500 MRR (+4.9%)\n\nOVERALL GROWTH: +30.8% MRR growth (May to November)\nAcceleration: Revenue growth rate increasing month-over-month\n\nRESENUE COMPOSITION:\n• Enterprise Segment: $87,400 (97.6% of total MRR)\n• Mid-Market Segment: $1,800 (2.0% of total MRR)\n• Small Business Segment: $300 (0.4% of total MRR)\n\nNEW CUSTOMER ACQUISITION:\n• 6-Month New Customers Added: 120 accounts\n• Average New Customer MRR: $850\n• New Customer Acquisition Growth: +18% vs prior 6 months\n\nEXPANSION REVENUE:\n• Total Expansion Revenue (6-month): $47,000\n• Number of Upsell Transactions: 34\n• Average Upsell Value: $1,382\n• Expansion Rate: 52.5% (expansion revenue / new MRR)\n\nCHURN METRICS:\n• Churned Customers (6-month): 8 accounts\n• Churned MRR (6-month): $12,200\n• Monthly Churn Rate: 1.8% (trailing average)\n• Net MRR Growth: 103.3% (organic growth exceeds churn)\n\nREVENUE TRENDS & INSIGHTS:\n\n1. Strong Enterprise Focus\n   97.6% of revenue from enterprise customers indicates strong product-market fit with larger organizations\n\n2. Healthy Expansion Revenue\n   $47K expansion revenue over 6 months demonstrates customer satisfaction and successful upsell strategy\n\n3. Low Churn Rate\n   1.8% monthly churn is well below SaaS benchmarks (3-5%), indicating strong customer retention\n\n4. Accelerating Growth\n   +30.8% MRR growth with month-over-month acceleration suggests building momentum\n\n5. Acquisition Velocity\n   120 new customers in 6 months shows strong market demand\n\nFORWARD PROJECTIONS:\n• Q4 2025 Projected MRR: $98,500 (assuming +3% monthly growth)\n• Q1 2026 Projected ARR: $1,182,000\n• Annual Growth Projection (2025): +28-35%",
        timestamp: new Date(BASE_TIME - 28795000),
      },
      {
        id: "3",
        role: "user",
        content: "Which accounts have the highest expansion opportunity?",
        timestamp: new Date(BASE_TIME - 28700000),
      },
      {
        id: "4",
        role: "assistant",
        content:
          "HIGH-VALUE CUSTOMER EXPANSION ANALYSIS\n\nPORTFOLIO OVERVIEW:\n• Enterprise Segment: 6 accounts\n• Total Enterprise MRR: $109,600 (55.1% of portfolio)\n• Combined Expansion Opportunity: $312,000+ annual\n\nTOP EXPANSION OPPORTUNITY ACCOUNTS:\n\n1. CloudSync Technologies\n   Current MRR: $22,000\n   Annual Spend: $264,000\n   Health Score: 90/100\n   Expansion Opportunity Score: 88%\n   Projected Additional MRR: $8,800-$15,400\n   \n   Expansion Drivers:\n   • Currently using 4 of 8 available modules\n   • Can expand to Enterprise Plus tier (+$3,200/month)\n   • Additional integrations available (+$2,100/month)\n   • Advanced reporting add-on (+$1,800/month)\n   \n   Action Plan:\n   • Schedule quarterly business review to discuss roadmap\n   • Demonstrate unused features through personalized demo\n   • Present ROI case study from similar customer\n   • Propose packaged upgrade at 15% discount\n\n2. Global Finance Corp\n   Current MRR: $18,900\n   Annual Spend: $226,800\n   Health Score: 85/100\n   Expansion Opportunity Score: 82%\n   Projected Additional MRR: $6,200-$11,300\n   \n   Expansion Drivers:\n   • Compliant users: 45 of 120 potential users\n   • Advanced compliance module (not yet purchased)\n   • Custom integrations in development\n   • Multi-entity reporting needs\n   \n   Action Plan:\n   • Introduce compliance-focused CSM\n   • Bundle compliance + reporting modules\n   • Offer enterprise support tier upgrade\n\n3. Manufacturing Pro\n   Current MRR: $15,600\n   Annual Spend: $187,200\n   Health Score: 82/100\n   Expansion Opportunity Score: 72%\n   Projected Additional MRR: $4,800-$8,100\n   \n   Expansion Drivers:\n   • Production line integration potential\n   • Advanced analytics for manufacturing\n   • Multi-site coordination tools\n   • Supply chain integration\n   \n   Action Plan:\n   • Conduct industry-specific workshop\n   • Pilot advanced analytics features\n   • Identify key use cases for expansion\n\n4. TechCorp Solutions\n   Current MRR: $12,500\n   Annual Spend: $150,000\n   Health Score: 92/100\n   Expansion Opportunity Score: 85%\n   Projected Additional MRR: $5,300-$9,600\n   \n   Expansion Drivers:\n   • High engagement indicates readiness\n   • API usage suggests custom integrations possible\n   • Development team expanding (20% headcount growth)\n   • New product launch requiring additional modules\n   \n   Action Plan:\n   • Present custom development partnership proposal\n   • Offer API enterprise tier\n   • Bundle new modules at launch\n\n5. RetailMax Inc\n   Current MRR: $5,800\n   Annual Spend: $69,600\n   Health Score: 88/100\n   Expansion Opportunity Score: 78%\n   Projected Additional MRR: $2,800-$4,600\n   \n   Expansion Drivers:\n   • Store count growing from 12 to 18\n   • Additional users needed per expansion\n   • Point-of-sale integration requirements\n   • Inventory management expansion\n   \n   Action Plan:\n   • Bundle store expansion package\n   • Offer discount per new location\n   • Implement automated scaling module\n\n6. TechVenture Capital\n   Current MRR: $3,100\n   Annual Spend: $37,200\n   Health Score: 80/100\n   Expansion Opportunity Score: 64%\n   Projected Additional MRR: $1,500-$2,400\n   \n   Expansion Drivers:\n   • Fund size increasing by $50M\n   • Portfolio company tracking needs\n   • Performance analytics requirement\n   \n   Action Plan:\n   • Align offering with fund growth\n   • Portfolio analytics solution proposal\n\nCOLLECTIVE EXPANSION OPPORTUNITY:\n• Total Potential Additional MRR: $29,000-$51,400\n• Average Expansion per Account: $5,200-$8,900\n• Time to Realization: 3-6 months\n• Recommended Implementation Timeline:\n  - Month 1: Quarterly business reviews and needs assessment\n  - Month 2-3: Solution demos and pilot programs\n  - Month 4-6: Contract amendments and implementation\n\nKEY SUCCESS FACTORS:\n1. Assign dedicated expansion CSM for each top-4 account\n2. Develop industry-specific expansion packages\n3. Create expansion collateral highlighting ROI\n4. Implement monthly expansion tracking metrics\n5. Offer time-limited promotional pricing for bundled features\n\nEXPECTED IMPACT:\nConservative expansion of top 6 accounts could generate additional $15K-25K MRR within 6 months, representing 17-28% revenue growth from existing customer base alone.",
        timestamp: new Date(BASE_TIME - 28690000),
      },
    ],
  },
]

export function getRandomConversation(): DemoConversation {
  return demoConversations[Math.floor(Math.random() * demoConversations.length)]
}

export function getConversationByTitle(title: string): DemoConversation | undefined {
  return demoConversations.find((conv) => conv.title === title)
}
