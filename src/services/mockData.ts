import type { 
  EventItem, 
  Client, 
  Supplier, 
  UserProfile, 
  TimingItem, 
  ProcessNode, 
  AuditLog,
  EventStageConfig,
  EventCrewMember,
  WorkflowDefinition,
  RolePermissionConfig
} from '../types/metodicah';

export const DEFAULT_EVENT_STAGES: EventStageConfig[] = [
  { id: 'backlog', label: 'Backlog', color: '#94a3b8' },
  { id: 'meeting', label: 'Meeting', color: '#38bdf8' },
  { id: 'deploy', label: 'Deploy', color: '#f59e0b' },
  { id: 'approved', label: 'Approved', color: '#10b981' },
  { id: 'rejected', label: 'Rejected', color: '#ef4444' },
  { id: 'pre_prod', label: 'Pre Prod', color: '#8b5cf6' },
  { id: 'prod', label: 'Prod', color: '#06b6d4' },
  { id: 'post_prod', label: 'Post Prod', color: '#64748b' }
];

export const DEFAULT_ROLE_PERMISSIONS: RolePermissionConfig[] = [
  {
    id: 'prod_create_edit',
    permission: 'Crear & Editar Producciones',
    category: 'Producción',
    admin: true,
    team: true,
    guest: false
  },
  {
    id: 'finance_approve_budget',
    permission: 'Aprobar Presupuesto & Despliegue',
    category: 'Finanzas',
    admin: true,
    team: false,
    guest: false
  },
  {
    id: 'dir_manage_suppliers_clients',
    permission: 'Gestión de Proveedores & Clientes',
    category: 'Directorio',
    admin: true,
    team: true,
    guest: false
  },
  {
    id: 'staff_manage_crew',
    permission: 'Gestión de Personal Técnico (Crew)',
    category: 'Staff',
    admin: true,
    team: false,
    guest: false
  },
  {
    id: 'system_config_branding',
    permission: 'Configuración Global & Branding',
    category: 'Sistema',
    admin: true,
    team: false,
    guest: false
  },
  {
    id: 'events_view_timeline',
    permission: 'Ver Timeline & Hitos de Eventos',
    category: 'Cronograma',
    admin: true,
    team: true,
    guest: true
  },
  {
    id: 'files_download_docs',
    permission: 'Descargar Documentos & Hojas de Ruta',
    category: 'Archivos',
    admin: true,
    team: true,
    guest: true
  }
];

export const PREDEFINED_SCOPES: string[] = [];
export const DEFAULT_CONFIGURED_SCOPES: string[] = [];

export const INITIAL_CREW_MEMBERS: EventCrewMember[] = [
  {
    id: 'crew_01',
    userId: 'usr_01',
    userName: 'Juan Martín',
    documentNumber: '32.450.812',
    taxId: '20-32450812-4',
    birthDate: '1986-04-12',
    type: 'staff_interno',
    sector: 'Producción General',
    roleInEvent: 'Productor General / Lead',
    seniority: 'lead',
    userEmail: 'juan@metodicah.com',
    phone: '+54 9 11 5555-0199',
    emergencyContactName: 'María Rossi',
    emergencyContactPhone: '+54 9 11 5555-0198',
    city: 'Palermo, CABA',
    artInsurance: 'La Segunda ART',
    clothingSize: 'L',
    dietaryRestrictions: 'Estándar',
    notes: 'Coordinación general de producciones masivas y festivales.',
    activeEventsCount: 3,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    hasSystemAccess: true,
    globalRole: 'admin',
    createdAt: '2026-01-01'
  },
  {
    id: 'crew_02',
    userId: 'usr_02',
    userName: 'Martín Silva',
    documentNumber: '35.120.994',
    taxId: '20-35120994-8',
    birthDate: '1990-09-25',
    type: 'staff_interno',
    sector: 'Infraestructura',
    roleInEvent: 'Jefe de Campo & Rigging',
    seniority: 'senior',
    userEmail: 'martin@metodicah.com',
    phone: '+54 9 11 4400-9988',
    emergencyContactName: 'Clara Silva',
    emergencyContactPhone: '+54 9 11 4400-9980',
    city: 'Vicente López, PBA',
    artInsurance: 'Federación Patronal ART',
    clothingSize: 'XL',
    dietaryRestrictions: 'Sin TACC (Celíaco)',
    notes: 'Certificación internacional en cálculo de cargas y motores Layher/Verlinde.',
    activeEventsCount: 2,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    hasSystemAccess: true,
    globalRole: 'team_member',
    createdAt: '2026-01-05'
  },
  {
    id: 'crew_03',
    userId: 'usr_03',
    userName: 'Laura Gómez',
    documentNumber: '38.991.203',
    taxId: '27-38991203-2',
    birthDate: '1994-02-18',
    type: 'staff_interno',
    sector: 'Escenario',
    roleInEvent: 'Stage Manager & Artística',
    seniority: 'senior',
    userEmail: 'laura@metodicah.com',
    phone: '+54 9 11 3322-1100',
    emergencyContactName: 'Pedro Gómez',
    emergencyContactPhone: '+54 9 11 3322-1109',
    city: 'San Isidro, PBA',
    artInsurance: 'La Segunda ART',
    clothingSize: 'M',
    dietaryRestrictions: 'Vegetariano',
    notes: 'Coordinación de camarines, hospitalidad y control de escenario.',
    activeEventsCount: 3,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    hasSystemAccess: true,
    globalRole: 'team_member',
    createdAt: '2026-01-10'
  },
  {
    id: 'crew_04',
    userId: 'usr_04',
    userName: 'Gonzalo Torres',
    documentNumber: '40.312.871',
    taxId: '20-40312871-6',
    birthDate: '1997-11-05',
    type: 'freelancer',
    sector: 'Técnica Audio/Video',
    roleInEvent: 'Director Técnico Audiovisual',
    seniority: 'semi_senior',
    userEmail: 'gonzalo@metodicah.com',
    phone: '+54 9 11 6677-8899',
    emergencyContactName: 'Sonia Torres',
    emergencyContactPhone: '+54 9 11 6677-8800',
    city: 'San Isidro, PBA',
    artInsurance: 'Prevención ART',
    clothingSize: 'L',
    dietaryRestrictions: 'Estándar',
    notes: 'Especialista en mapeo de matrices de video, procesadores Novastar y consolas Yamaha/Digico.',
    activeEventsCount: 1,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-02-01'
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr_01',
  name: 'Juan Martín',
  email: 'juan@metodicah.com',
  globalRole: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  phone: '+54 9 11 5555-0199',
  specialty: 'Dirección General de Producción'
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli_01',
    clientType: 'empresa',
    company: 'Obras Music & Entertainment S.A.',
    fantasyName: 'Estadio Obras',
    name: 'Esteban Di Meglio',
    contactRole: 'Director de Operaciones',
    industry: 'Entretenimiento & Música',
    taxId: '30-71458921-9',
    taxCondition: 'Responsable Inscripto',
    email: 'contacto@obrasmusic.com',
    phone: '+54 11 4700-1234',
    website: 'https://obrasmusic.com',
    billingContactName: 'Claudia Rivas',
    billingContactEmail: 'facturacion@obrasmusic.com',
    paymentTerms: '50% anticipo + saldo 48hs antes del evento',
    supplierRequirements: 'ART obligatoria con nómina y cláusula de no repetición, Seguros de RC vigentes.',
    address: 'Av. del Libertador 7395',
    city: 'CABA',
    state: 'Buenos Aires',
    zipCode: 'C1429',
    notes: 'Cliente preferencial para recitales internacionales de gran escala y festivales indoor.',
    activeEventsCount: 2,
    createdAt: '2026-01-15'
  },
  {
    id: 'cli_02',
    clientType: 'empresa',
    company: 'Sonorama Global Media Group',
    fantasyName: 'Festival Sonorama Corp',
    name: 'Valeria Mansilla',
    contactRole: 'Gerenta de Producción BTL',
    industry: 'Marketing & Festivales',
    taxId: '30-78129034-4',
    taxCondition: 'Responsable Inscripto',
    email: 'eventos@sonorama.com',
    phone: '+54 11 4822-9988',
    website: 'https://sonoramaglobal.com',
    billingContactName: 'Gastón Pereyra',
    billingContactEmail: 'pagos@sonorama.com',
    paymentTerms: '30 días fecha de factura',
    supplierRequirements: 'EPP reglamentario en montaje, certificado de altura para rigging.',
    address: 'Dardo Rocha 2450',
    city: 'San Isidro',
    state: 'Buenos Aires',
    zipCode: 'B1640',
    notes: 'Festivales al aire libre 2 a 3 días de duración. Alto requerimiento de logística.',
    activeEventsCount: 1,
    createdAt: '2026-02-01'
  },
  {
    id: 'cli_03',
    clientType: 'empresa',
    company: 'Nexus Brand Experiences S.R.L.',
    fantasyName: 'Agencia BTL Nexus',
    name: 'Laura Gómez',
    contactRole: 'Directora de Cuentas',
    industry: 'Publicidad & Eventos Corporativos',
    taxId: '33-69812450-9',
    taxCondition: 'Responsable Inscripto',
    email: 'laura@nexusbtl.com',
    phone: '+54 11 4999-7711',
    website: 'https://nexusbtl.com',
    billingContactName: 'Finanzas Nexus',
    billingContactEmail: 'adm@nexusbtl.com',
    paymentTerms: 'Contado contra entrega de minuta final',
    supplierRequirements: 'Acreditaciones con DNI previo 24hs.',
    address: 'Gorriti 4800',
    city: 'Palermo, CABA',
    state: 'Buenos Aires',
    zipCode: 'C1414',
    notes: 'Lanzamientos de marcas corporativas y experiencias VIP.',
    activeEventsCount: 1,
    createdAt: '2026-03-10'
  },
  {
    id: 'cli_04',
    clientType: 'persona',
    name: 'Mariana & Federico Rossi',
    documentNumber: '34.890.122',
    taxId: '27-34890122-3',
    taxCondition: 'Consumidor Final',
    email: 'mariana.rossi@gmail.com',
    phone: '+54 9 11 6789-0123',
    birthDate: '1989-11-20',
    frequentEventType: 'Boda / Casamiento',
    preferences: 'Menú celíaco para 15 invitados, ambientación estilo rústico moderno, iluminación cálida.',
    address: 'Av. Alvear 1890, Piso 5',
    city: 'Recoleta, CABA',
    state: 'Buenos Aires',
    zipCode: 'C1014',
    notes: 'Boda prevista en estancia campestre con 220 invitados.',
    activeEventsCount: 1,
    createdAt: '2026-03-15'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup_01',
    name: 'MaxiSound Pro',
    company: 'MaxiSound Audio Systems S.R.L.',
    category: 'audio',
    taxId: '30-71122334-9',
    taxCondition: 'Responsable Inscripto',
    contactName: 'Maximiliano Rossi',
    contactRole: 'Director de Ingeniería de Sonido',
    email: 'tecnica@maxisound.com',
    phone: '+54 9 11 4411-2233',
    emergencyPhone: '+54 9 11 4411-2200',
    website: 'https://maxisound.com.ar',
    equipmentHighlights: 'Sistemas L-Acoustics K2/Kara, Consolas DiGiCo Quantum 338/SD12, Microfonía Shure Axient Digital',
    billingEmail: 'facturacion@maxisound.com',
    paymentTerms: '50% anticipo al confirmar, saldo a 15 días evento',
    address: 'Av. Warnes 1520',
    city: 'Chacarita, CABA',
    state: 'Buenos Aires',
    zipCode: 'C1414',
    notes: 'Especialista en producciones masivas nivel estadio y festivales internacionales.',
    activeEventsCount: 2,
    createdAt: '2026-01-10'
  },
  {
    id: 'sup_02',
    name: 'Lumina Tech',
    company: 'Lumina FX & Lighting S.A.',
    category: 'lighting',
    taxId: '30-70988776-5',
    taxCondition: 'Responsable Inscripto',
    contactName: 'Martín Varela',
    contactRole: 'Jefe de Operaciones Técnicas',
    email: 'cotizaciones@luminatech.com',
    phone: '+54 9 11 4422-3344',
    emergencyPhone: '+54 9 11 4422-3300',
    website: 'https://luminatech.com.ar',
    equipmentHighlights: 'Cabezas móviles Robe MegaPointe / Forte, Consolas GrandMA3 Full Size, Efectos de CO2 y Chispas Frías Sparkular',
    billingEmail: 'adm@luminatech.com',
    paymentTerms: 'Contado contra entrega de minuta técnica',
    address: 'Av. San Martín 3200',
    city: 'San Martín, PBA',
    state: 'Buenos Aires',
    zipCode: 'B1650',
    notes: 'Programación de shows en tiempo real, operarios certificados MA Lighting.',
    activeEventsCount: 2,
    createdAt: '2026-01-12'
  },
  {
    id: 'sup_03',
    name: 'Staging & Rigging Solutions',
    company: 'Rigging Pro Argentina S.R.L.',
    category: 'rigging',
    taxId: '33-71456987-9',
    taxCondition: 'Responsable Inscripto',
    contactName: 'Carlos Mendoza',
    contactRole: 'Director de Seguridad & Rigging',
    email: 'operaciones@riggingpro.com',
    phone: '+54 9 11 4433-5566',
    emergencyPhone: '+54 9 11 4433-5500',
    website: 'https://riggingpro.com.ar',
    equipmentHighlights: 'Estructuras Layher Allround, Motores Verlinde 1T / 2T, Certificación TÜV Rheinland',
    billingEmail: 'pagos@riggingpro.com',
    paymentTerms: '40% anticipo, 60% fin de montaje',
    address: 'Colectora Panamericana Km 28',
    city: 'Don Torcuato, PBA',
    state: 'Buenos Aires',
    zipCode: 'B1611',
    notes: 'Montajes de escenarios cubiertos, techos Layer y torres de delay con cálculo estático de vientos.',
    activeEventsCount: 1,
    createdAt: '2026-02-05'
  },
  {
    id: 'sup_04',
    name: 'Gourmet Backstage Catering',
    company: 'Backstage Food Co. S.A.',
    category: 'catering',
    taxId: '30-71654321-2',
    taxCondition: 'Responsable Inscripto',
    contactName: 'Sofía Almada',
    contactRole: 'Coordinadora de Hospitality & Artistas',
    email: 'catering@backstagefood.com',
    phone: '+54 9 11 4455-6677',
    website: 'https://backstagefood.com.ar',
    equipmentHighlights: 'Food trucks de producción, hornos móviles de regeneración, menús adaptados sin TACC / Vegano',
    billingEmail: 'administracion@backstagefood.com',
    paymentTerms: '100% anticipado 72hs previas al evento',
    address: 'Thames 1840',
    city: 'Palermo Soho, CABA',
    state: 'Buenos Aires',
    zipCode: 'C1414',
    notes: 'Servicio exclusivo para camarines VIP, crew técnico y hospitalities de artistas.',
    activeEventsCount: 1,
    createdAt: '2026-02-20'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt_101',
    code: 'MET-2026-001',
    title: 'Rock Festival Arena 2026',
    date: '2026-08-10',
    venue: 'Estadio Obras Sanitarias',
    location: 'Av. del Libertador 7395, Núñez, CABA',
    clientId: 'cli_01',
    clientName: 'Obras Music & Entertainment',
    timeRange: {
      startTime: '16:00',
      endTime: '23:30'
    },
    attendeesCount: 12000,
    scoutingDate: '2026-07-15',
    deployDate: '2026-07-20',
    stageId: 'prod',
    concept: 'Celebración épica del rock nacional e internacional con despliegue escénico 360°',
    summary: 'Festival masivo con 8 bandas en vivo, escenario principal y zona VIP sponsors.',
    scope: [
      'Producción Técnica Integral',
      'Audio FOH & Monitores',
      'Iluminación Escenográfica & FX',
      'Estructuras & Rigging Layher'
    ],
    crewIds: ['usr_01', 'usr_02', 'usr_03'],
    thirdPartiesInvolved: [
      'Gobierno de la Ciudad (Habilitaciones & Tránsito)',
      'Cruz Roja Argentina (Puesto Sanitario Principal)',
      'Sponsor Monster Energy (Zona Experiencias VIP)'
    ],
    clientPreferences: [
      'Acceso backstage con pulseras RFID de color dorado',
      'Catering sin gluten obligatorio en camarines principales',
      'Grabación multipista de audio directo a disco'
    ],
    notes: 'Prueba de sonido estricta a las 14:00hs del 10/08.',
    createdAt: '2026-07-01',
    updatedAt: '2026-08-04'
  },
  {
    id: 'evt_102',
    code: 'MET-2026-002',
    title: 'Lanzamiento Vehículo MotorX 2027',
    date: '2026-08-25',
    venue: 'Centro de Convenciones Recoleta',
    location: 'Av. Figueroa Alcorta 2099, Recoleta, CABA',
    clientId: 'cli_03',
    clientName: 'Nexus Brand Experiences',
    timeRange: {
      startTime: '19:00',
      endTime: '23:00'
    },
    attendeesCount: 650,
    scoutingDate: '2026-08-05',
    deployDate: '2026-08-10',
    stageId: 'pre_prod',
    concept: 'Presentación futurista y minimalista con revelación holográfica del nuevo modelo eléctrico',
    summary: 'Evento de presentación corporativa para directivos, prensa internacional y líderes de industria.',
    scope: [
      'Pantallas LED & Video 4K',
      'Iluminación Escenográfica & FX',
      'Catering & Hospitality VIP'
    ],
    crewIds: ['usr_01', 'usr_04'],
    thirdPartiesInvolved: [
      'Prensa Automotriz Internacional',
      'Servicio de Valet Parking & Seguridad Privada',
      'Agencia de Prensa Burson'
    ],
    clientPreferences: [
      'Firma de NDA para todo el personal técnico de montaje',
      'Temperatura del salón a 21°C constantes',
      'Iluminación puntual cenital color blanco neutro 4000K'
    ],
    notes: 'Revelación del vehículo coordinada con cues de video a las 20:45hs.',
    createdAt: '2026-07-15',
    updatedAt: '2026-08-03'
  },
  {
    id: 'evt_103',
    code: 'MET-2026-003',
    title: 'Sonorama EDM Outdoor Experience',
    date: '2026-09-18',
    venue: 'Predio Campo Abierto San Isidro',
    location: 'Av. Márquez 504, San Isidro, Prov. de Buenos Aires',
    clientId: 'cli_02',
    clientName: 'Sonorama Global',
    timeRange: {
      startTime: '15:00',
      endTime: '04:00'
    },
    attendeesCount: 25000,
    scoutingDate: '2026-08-12',
    deployDate: '2026-08-18',
    stageId: 'deploy',
    concept: 'Festival inmersivo al aire libre con visuales reactivas y puesta de láseres de alta potencia',
    summary: 'Festival de música electrónica con 3 escenarios concurrentes y domos temáticos.',
    scope: [
      'Producción Técnica Integral',
      'Audio FOH & Monitores',
      'Iluminación Escenográfica & FX',
      'Logística & Generadores Eléctricos',
      'Streaming & Cobertura Broadcast'
    ],
    crewIds: ['usr_01', 'usr_02', 'usr_03', 'usr_04'],
    thirdPartiesInvolved: [
      'Municipalidad de San Isidro (Control Acústico y Tránsito)',
      'Empresa de Generadores EnergyPower 500kVA',
      'Compañía de Seguridad Privada Shield'
    ],
    clientPreferences: [
      'Límite de decibeles FOH controlado a 102 dBA Leq 15min',
      'Puestos de hidratación gratuita en perímetro',
      'Monitoreo in-ear para todos los DJs internacionales'
    ],
    notes: 'Ajuste de contrato con proveedores energéticos en proceso.',
    createdAt: '2026-07-28',
    updatedAt: '2026-08-04'
  }
];

export const MOCK_TIMINGS: Record<string, TimingItem[]> = {
  'evt_101': [
    {
      id: 't_01',
      eventId: 'evt_101',
      timeStart: '07:00',
      timeEnd: '09:00',
      title: 'Apertura de Predio e Ingrese de Camiones Layher',
      sector: 'Logística & Montaje',
      responsible: 'Martin (Jefe de Campo)',
      supplierName: 'Staging & Rigging Solutions',
      status: 'completed',
      order: 1
    },
    {
      id: 't_02',
      eventId: 'evt_101',
      timeStart: '09:00',
      timeEnd: '12:00',
      title: 'Colgado de Motores y Estructura de Techo (Rigging)',
      sector: 'Escenario Principal',
      responsible: 'Gonzalo Rigging',
      supplierName: 'Staging & Rigging Solutions',
      status: 'completed',
      order: 2
    },
    {
      id: 't_03',
      eventId: 'evt_101',
      timeStart: '12:00',
      timeEnd: '14:00',
      title: 'Montaje de PA L-Acoustics K1 y Consolas FOH',
      sector: 'Audio',
      responsible: 'Fede Sonido',
      supplierName: 'MaxiSound Pro',
      status: 'in_progress',
      order: 3
    },
    {
      id: 't_04',
      eventId: 'evt_101',
      timeStart: '14:00',
      timeEnd: '15:30',
      title: 'Check de Conexión Eléctrica y Parche de Luces',
      sector: 'Iluminación & FX',
      responsible: 'Lucas Iluminación',
      supplierName: 'Lumina Tech',
      status: 'pending',
      order: 4
    },
    {
      id: 't_05',
      eventId: 'evt_101',
      timeStart: '16:00',
      timeEnd: '18:00',
      title: 'Prueba de Sonido Banda Headliner',
      sector: 'Escenario / Artística',
      responsible: 'Juan Martín (Producción)',
      supplierName: 'MaxiSound Pro',
      status: 'pending',
      order: 5
    },
    {
      id: 't_06',
      eventId: 'evt_101',
      timeStart: '19:00',
      timeEnd: '19:30',
      title: 'Apertura de Puertas a Público General',
      sector: 'Accesos & Seguridad',
      responsible: 'Control General',
      status: 'pending',
      order: 6
    }
  ]
};

export const MOCK_PROCESS_NODES: Record<string, ProcessNode[]> = {
  'evt_101': [
    {
      id: 'node_1',
      eventId: 'evt_101',
      label: 'Habilitación Municipal y Permisos',
      category: 'Legal & Seguros',
      predecessorIds: [],
      successorIds: ['node_2'],
      status: 'completed',
      estimatedHours: 48,
      assignedTo: 'Legales METODICAH',
      position: { x: 50, y: 150 }
    },
    {
      id: 'node_2',
      eventId: 'evt_101',
      label: 'Montaje EstructuraLayher Escenario',
      category: 'Infraestructura',
      predecessorIds: ['node_1'],
      successorIds: ['node_3', 'node_4'],
      status: 'completed',
      estimatedHours: 12,
      assignedTo: 'Rigging Pro SRL',
      position: { x: 320, y: 150 }
    },
    {
      id: 'node_3',
      eventId: 'evt_101',
      label: 'Colgado de Sistemas de Audio FOH',
      category: 'Técnica Audio',
      predecessorIds: ['node_2'],
      successorIds: ['node_5'],
      status: 'active',
      estimatedHours: 4,
      assignedTo: 'MaxiSound Pro',
      position: { x: 600, y: 80 }
    },
    {
      id: 'node_4',
      eventId: 'evt_101',
      label: 'Parrilla de Iluminación y Pantallas LED',
      category: 'Técnica Luces/Video',
      predecessorIds: ['node_2'],
      successorIds: ['node_5'],
      status: 'pending',
      estimatedHours: 5,
      assignedTo: 'Lumina Tech',
      position: { x: 600, y: 220 }
    },
    {
      id: 'node_5',
      eventId: 'evt_101',
      label: 'Soundcheck General e Integración',
      category: 'Artística',
      predecessorIds: ['node_3', 'node_4'],
      successorIds: ['node_6'],
      status: 'pending',
      estimatedHours: 3,
      assignedTo: 'Producción General',
      position: { x: 880, y: 150 }
    },
    {
      id: 'node_6',
      eventId: 'evt_101',
      label: 'Show en Vivo & Puertas',
      category: 'Operación Show',
      predecessorIds: ['node_5'],
      successorIds: [],
      status: 'pending',
      estimatedHours: 6,
      assignedTo: 'Director del Evento',
      position: { x: 1140, y: 150 }
    }
  ]
};

export const MOCK_LOGS: AuditLog[] = [
  {
    id: 'log_01',
    eventId: 'evt_101',
    userId: 'usr_01',
    userName: 'Juan Martín',
    action: 'ACTUALIZACION_TIMING',
    details: 'Cambió estado de "Montaje PA L-Acoustics" a EN PROGRESO',
    timestamp: '2026-08-04 02:45'
  },
  {
    id: 'log_02',
    eventId: 'evt_101',
    userId: 'usr_01',
    userName: 'Juan Martín',
    action: 'ACTUALIZACION_SCOPE',
    details: 'Actualizado scope técnico: Requerimientos Estadio Obras v2',
    timestamp: '2026-08-04 01:12'
  },
  {
    id: 'log_03',
    eventId: 'evt_101',
    userId: 'usr_02',
    userName: 'Martin Producción',
    action: 'ASIGNACION_CREW',
    details: 'Asignado proveedor "Staging & Rigging Solutions" al evento MET-2026-001',
    timestamp: '2026-08-03 18:30'
  }
];

export const INITIAL_WORKFLOWS: WorkflowDefinition[] = [
  {
    id: 'wf_01',
    accountId: 'acc_demo_01',
    name: 'Pipeline Estándar de Producción Integral',
    description: 'Flujo completo de producción para festivales masivos y recitales de gran escala.',
    category: 'Producción General',
    isDefault: true,
    createdAt: '2026-01-10',
    updatedAt: '2026-02-15',
    nodes: [
      {
        id: 'node_1',
        workflowId: 'wf_01',
        label: 'Habilitación Municipal y Permisos',
        category: 'Legal & Seguros',
        predecessorIds: [],
        successorIds: ['node_2'],
        status: 'completed',
        estimatedHours: 48,
        assignedTo: 'Legales METODICAH',
        position: { x: 50, y: 150 }
      },
      {
        id: 'node_2',
        workflowId: 'wf_01',
        label: 'Montaje Estructura Layher Escenario',
        category: 'Infraestructura',
        predecessorIds: ['node_1'],
        successorIds: ['node_3', 'node_4'],
        status: 'completed',
        estimatedHours: 12,
        assignedTo: 'Rigging Pro SRL',
        position: { x: 340, y: 150 }
      },
      {
        id: 'node_3',
        workflowId: 'wf_01',
        label: 'Colgado de Sistemas de Audio FOH',
        category: 'Técnica Audio',
        predecessorIds: ['node_2'],
        successorIds: ['node_5'],
        status: 'active',
        estimatedHours: 6,
        assignedTo: 'MaxiSound Pro',
        position: { x: 640, y: 60 }
      },
      {
        id: 'node_4',
        workflowId: 'wf_01',
        label: 'Parrilla de Iluminación y Pantallas LED',
        category: 'Técnica Luces/Video',
        predecessorIds: ['node_2'],
        successorIds: ['node_5'],
        status: 'pending',
        estimatedHours: 5,
        assignedTo: 'Lumina Tech',
        position: { x: 640, y: 240 }
      },
      {
        id: 'node_5',
        workflowId: 'wf_01',
        label: 'Soundcheck General e Integración',
        category: 'Artística',
        predecessorIds: ['node_3', 'node_4'],
        successorIds: ['node_6'],
        status: 'pending',
        estimatedHours: 3,
        assignedTo: 'Producción General',
        position: { x: 940, y: 150 }
      },
      {
        id: 'node_6',
        workflowId: 'wf_01',
        label: 'Show en Vivo & Operación',
        category: 'Operación Show',
        predecessorIds: ['node_5'],
        successorIds: [],
        status: 'pending',
        estimatedHours: 6,
        assignedTo: 'Director del Evento',
        position: { x: 1220, y: 150 }
      }
    ]
  },
  {
    id: 'wf_02',
    accountId: 'acc_demo_01',
    name: 'Flujo Rápido Corporativo & BTL',
    description: 'Protocolo ágil para lanzamientos de producto, conferencias corporativas y eventos de marca.',
    category: 'Eventos Corporativos',
    isDefault: false,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-20',
    nodes: [
      {
        id: 'corp_1',
        workflowId: 'wf_02',
        label: 'Scouting de Locación & Factibilidad',
        category: 'Producción',
        predecessorIds: [],
        successorIds: ['corp_2'],
        status: 'completed',
        estimatedHours: 4,
        assignedTo: 'Lead Producer',
        position: { x: 50, y: 150 }
      },
      {
        id: 'corp_2',
        workflowId: 'wf_02',
        label: 'Aprobación de Rider & Cotizaciones',
        category: 'Comercial & Técnica',
        predecessorIds: ['corp_1'],
        successorIds: ['corp_3'],
        status: 'completed',
        estimatedHours: 24,
        assignedTo: 'Finanzas & Técnica',
        position: { x: 340, y: 150 }
      },
      {
        id: 'corp_3',
        workflowId: 'wf_02',
        label: 'Montaje Escenográfico y Visuales',
        category: 'Operaciones',
        predecessorIds: ['corp_2'],
        successorIds: ['corp_4'],
        status: 'active',
        estimatedHours: 8,
        assignedTo: 'Stage Manager',
        position: { x: 640, y: 150 }
      },
      {
        id: 'corp_4',
        workflowId: 'wf_02',
        label: 'Ejecución de Show y Desmontaje',
        category: 'Operaciones',
        predecessorIds: ['corp_3'],
        successorIds: [],
        status: 'pending',
        estimatedHours: 10,
        assignedTo: 'Crew Líder',
        position: { x: 940, y: 150 }
      }
    ]
  }
];
