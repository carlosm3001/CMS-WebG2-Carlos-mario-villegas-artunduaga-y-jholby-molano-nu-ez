import { Noticia } from '../models/Notica.model';
import { EstadoPublicacion } from '../enum/EstadoPublicacion';

export const NOTICIAS: Noticia[] = [
  {
    id: 'not-001',
    titulo: 'Nueva Reserva Natural Protege 50,000 Hectáreas de Selva Virgen',
    subtitulo: 'Iniciativa de conservación histórica',
    contenido: 'Una iniciativa conjunta entre gobiernos locales y organizaciones internacionales ha logrado establecer una nueva área protegida que salvaguarda ecosistemas críticos y hábitats de especies en peligro de extinción. Esta reserva representa uno de los esfuerzos de conservación más significativos de la última década en la región amazónica.\n\nLa nueva área protegida incluye territorios que albergan una biodiversidad única, con especies endémicas que no se encuentran en ningún otro lugar del planeta. Científicos estiman que la zona contiene más de 2,000 especies de plantas y 500 especies de animales.\n\nLa colaboración entre comunidades locales, gobiernos y organizaciones ambientales ha sido fundamental para el éxito de esta iniciativa, estableciendo un modelo de conservación participativa que podría replicarse en otras regiones.',
    categoriaId: 'cat-conservacion',
    imagen: ['https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop'],
    autorUid: 'usr-001',
    fechaCreacion: new Date('2025-11-09'),
    fechaActualizacion: new Date('2025-11-09'),
    estado: EstadoPublicacion.PUBLICADO
  },
  {
    id: 'not-002',
    titulo: 'Avistan Jaguar Melanístico en Reserva Nacional',
    subtitulo: 'Raro ejemplar de jaguar negro documentado por científicos',
    contenido: 'Científicos documentan el avistamiento de un ejemplar extremadamente raro de jaguar negro en el corazón de la selva amazónica. Este avistamiento representa un evento significativo para la comunidad científica, ya que los jaguares melanísticos son extremadamente raros y difíciles de observar en su hábitat natural.\n\nEl equipo de investigación logró capturar imágenes de alta calidad del felino, proporcionando valiosa información sobre su comportamiento y patrones de movimiento. Los datos recopilados serán fundamentales para desarrollar estrategias de conservación más efectivas.\n\nExpertos señalan que este avistamiento confirma la importancia de mantener grandes extensiones de selva virgen, fundamentales para la supervivencia de grandes depredadores como el jaguar.',
    categoriaId: 'cat-fauna',
    imagen: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'],
    autorUid: 'usr-002',
    fechaCreacion: new Date('2025-11-08'),
    fechaActualizacion: new Date('2025-11-08'),
    estado: EstadoPublicacion.PUBLICADO
  },
  {
    id: 'not-003',
    titulo: 'Pueblos Indígenas Ganan Batalla Legal por sus Territorios',
    subtitulo: 'Histórica sentencia reconoce derechos ancestrales',
    contenido: 'Histórica sentencia reconoce los derechos ancestrales de comunidades nativas sobre más de 100,000 hectáreas de tierra. Este fallo judicial marca un precedente importante en la región y fortalece la protección de territorios indígenas en toda la Amazonía.\n\nLa decisión judicial llega después de años de lucha legal por parte de las comunidades, que han defendido sus territorios contra proyectos extractivos y deforestación ilegal. El reconocimiento oficial de sus derechos territoriales les brinda herramientas legales adicionales para proteger sus bosques.\n\nLíderes indígenas celebran la decisión como una victoria no solo para sus comunidades, sino para toda la humanidad, ya que estos territorios juegan un papel crucial en la regulación del clima global y la conservación de la biodiversidad.',
    categoriaId: 'cat-comunidades',
    imagen: ['https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=400&fit=crop'],
    autorUid: 'usr-003',
    fechaCreacion: new Date('2025-11-07'),
    fechaActualizacion: new Date('2025-11-07'),
    estado: EstadoPublicacion.PUBLICADO
  },
  {
    id: 'not-004',
    titulo: 'Descubren 20 Nuevas Especies de Plantas Medicinales',
    subtitulo: 'Tesoro botánico con potencial farmacéutico',
    contenido: 'Expedición científica revela un tesoro botánico con potencial farmacéutico en región remota de la Amazonía. Durante seis meses de investigación intensiva, un equipo internacional de botánicos ha identificado 20 especies de plantas nunca antes documentadas por la ciencia.\n\nAnálisis preliminares sugieren que varias de estas especies contienen compuestos con propiedades medicinales prometedoras, incluyendo potenciales tratamientos para enfermedades inflamatorias y antimicrobianas. Los investigadores trabajan en colaboración con comunidades locales, que han utilizado estas plantas en medicina tradicional durante generaciones.\n\nEste descubrimiento resalta la importancia crítica de proteger la biodiversidad amazónica, no solo por su valor ecológico sino también por su potencial para contribuir a la medicina moderna y el bienestar humano.',
    categoriaId: 'cat-ciencia',
    imagen: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop'],
    autorUid: 'usr-002',
    fechaCreacion: new Date('2025-11-06'),
    fechaActualizacion: new Date('2025-11-06'),
    estado: EstadoPublicacion.PUBLICADO
  },
  {
    id: 'not-005',
    titulo: 'Proyecto Planta 1 Millón de Árboles Nativos',
    subtitulo: 'Meta ambiciosa alcanzada en tiempo récord',
    contenido: 'Iniciativa de restauración ecológica alcanza su ambiciosa meta en tiempo récord con apoyo de voluntarios locales. El proyecto, que comenzó hace dos años, ha logrado plantar y establecer exitosamente un millón de árboles nativos en áreas degradadas de la Amazonía.\n\nMás de 5,000 voluntarios, incluyendo miembros de comunidades locales, estudiantes y trabajadores ambientales, participaron en las jornadas de plantación. La iniciativa no solo restaura ecosistemas dañados, sino que también proporciona empleo y fortalece la conexión de las comunidades con su entorno natural.\n\nEstudios de seguimiento muestran una tasa de supervivencia del 85% de los árboles plantados, superando las expectativas iniciales y demostrando la efectividad de las técnicas de restauración empleadas.',
    categoriaId: 'cat-reforestacion',
    imagen: ['https://images.unsplash.com/photo-1597423498219-04418210827d?w=600&h=400&fit=crop'],
    autorUid: 'usr-004',
    fechaCreacion: new Date('2025-11-05'),
    fechaActualizacion: new Date('2025-11-05'),
    estado: EstadoPublicacion.PUBLICADO
  },
  {
    id: 'not-006',
    titulo: 'Niveles del Río Amazonas Muestran Recuperación',
    subtitulo: 'Mejora después de histórica sequía',
    contenido: 'Datos recientes indican mejora en los niveles hídricos después de histórica sequía que afectó a miles de comunidades. Las mediciones más recientes muestran un incremento significativo en el caudal del río Amazonas y sus afluentes principales.\n\nLa sequía histórica del año pasado causó graves impactos en comunidades ribereñas, afectando el transporte fluvial, la pesca y el acceso a agua potable. La recuperación actual trae esperanza y alivio a miles de familias que dependen del río para su subsistencia.\n\nCientíficos atribuyen la recuperación a un patrón climático más favorable en los últimos meses, aunque advierten que el cambio climático continúa representando una amenaza a largo plazo para los sistemas hídricos amazónicos.',
    categoriaId: 'cat-hidrologia',
    imagen: ['https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600&h=400&fit=crop'],
    autorUid: 'usr-005',
    fechaCreacion: new Date('2025-11-04'),
    fechaActualizacion: new Date('2025-11-04'),
    estado: EstadoPublicacion.PUBLICADO
  },
  {
    id: 'not-007',
    titulo: 'Aumenta Población de Guacamayos en Área Protegida',
    subtitulo: 'Censo revela incremento del 30%',
    contenido: 'Censo revela incremento del 30% en la población de estas coloridas aves gracias a esfuerzos de conservación. Los guacamayos, emblemáticas aves de la Amazonía, han mostrado una recuperación notable en áreas donde se han implementado medidas de protección efectivas.\n\nEl éxito se atribuye a la combinación de protección de hábitat, control de tráfico ilegal de especies y programas de educación ambiental en comunidades locales. Los guacamayos son indicadores importantes de la salud del ecosistema, y su recuperación señala mejoras en la calidad ambiental general.\n\nInvestigadores planean expandir el programa de monitoreo a otras áreas de la Amazonía para evaluar el estado de las poblaciones de guacamayos en diferentes regiones y desarrollar estrategias de conservación específicas.',
    categoriaId: 'cat-fauna',
    imagen: ['https://images.unsplash.com/photo-1574026669322-0713dc2ab271?w=600&h=400&fit=crop'],
    autorUid: 'usr-003',
    fechaCreacion: new Date('2025-11-03'),
    fechaActualizacion: new Date('2025-11-03'),
    estado: EstadoPublicacion.PUBLICADO
  },
  {
    id: 'not-008',
    titulo: 'Turismo Sostenible Genera 5 Millones en Ingresos para Comunidades',
    subtitulo: 'Ecoturismo responsable se consolida como alternativa económica',
    contenido: 'El auge del ecoturismo responsable se consolida como alternativa económica viable para comunidades amazónicas, generando más de 5 millones de dólares en ingresos durante el último año. Esta cifra representa un incremento del 45% respecto al año anterior.\n\nEl modelo de turismo comunitario permite a las comunidades locales controlar y beneficiarse directamente de las actividades turísticas, manteniendo al mismo tiempo la conservación de sus territorios. Los visitantes tienen la oportunidad única de experimentar la cultura amazónica de manera auténtica.\n\nExpertos destacan que el turismo sostenible no solo proporciona ingresos económicos, sino que también fortalece la valoración de la cultura local y crea incentivos poderosos para la conservación del bosque.',
    categoriaId: 'cat-comunidades',
    imagen: ['https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=200&fit=crop'],
    autorUid: 'usr-001',
    fechaCreacion: new Date('2025-11-09T20:00:00.000Z'),
    fechaActualizacion: new Date('2025-11-09T20:00:00.000Z'),
    estado: EstadoPublicacion.PUBLICADO
  },
  {
    id: 'not-009',
    titulo: 'Investigadores Documentan Comportamiento Social Nunca Visto en Monos Aulladores',
    subtitulo: 'Complejas dinámicas sociales reveladas',
    contenido: 'Estudio de campo revela complejas dinámicas sociales que podrían cambiar nuestra comprensión sobre estos primates amazónicos. Durante 18 meses de observación continua, científicos han documentado patrones de comportamiento social previamente desconocidos en colonias de monos aulladores.\n\nLos hallazgos incluyen sistemas de comunicación más sofisticados de lo anticipado, jerarquías sociales flexibles y comportamientos de cooperación entre diferentes grupos familiares. Estas observaciones desafían conceptos previos sobre la estructura social de estos primates.\n\nLa investigación proporciona información valiosa para estrategias de conservación, ayudando a entender mejor los requerimientos de hábitat y las dinámicas poblacionales necesarias para la supervivencia a largo plazo de estas especies.',
    categoriaId: 'cat-ciencia',
    imagen: ['https://images.unsplash.com/photo-1602523958092-00a2e2229e0e?w=300&h=200&fit=crop'],
    autorUid: 'usr-002',
    fechaCreacion: new Date('2025-11-09T17:00:00.000Z'),
    fechaActualizacion: new Date('2025-11-09T17:00:00.000Z'),
    estado: EstadoPublicacion.PUBLICADO
  },
  {
    id: 'not-010',
    titulo: 'Drones con IA Revolucionan el Monitoreo de Deforestación',
    subtitulo: 'Tecnología permite detectar talas ilegales en tiempo real',
    contenido: 'Nueva tecnología permite detectar talas ilegales en tiempo real con precisión del 95%, revolucionando los esfuerzos de protección forestal en la Amazonía. El sistema combina drones autónomos con algoritmos de inteligencia artificial para monitorear grandes extensiones de selva.\n\nLa tecnología puede identificar cambios en la cobertura forestal en cuestión de horas, permitiendo respuestas rápidas por parte de autoridades ambientales. Esto representa una mejora significativa sobre los métodos tradicionales de monitoreo satelital, que pueden tener retrasos de semanas o meses.\n\nEl proyecto piloto ha resultado en la detención de numerosas operaciones ilegales de tala y se planea expandir el sistema a toda la cuenca amazónica en los próximos dos años.',
    categoriaId: 'cat-ciencia',
    imagen: ['https://images.unsplash.com/photo-1615398349754-b91d857d6177?w=300&h=200&fit=crop'],
    autorUid: 'usr-004',
    fechaCreacion: new Date('2025-11-09T14:00:00.000Z'),
    fechaActualizacion: new Date('2025-11-09T14:00:00.000Z'),
    estado: EstadoPublicacion.PUBLICADO
  },
  {
    id: 'not-011',
    titulo: 'Científicos Descubren Nuevo Sistema de Raíces que Conecta Toda la Selva',
    subtitulo: 'Red subterránea de comunicación entre árboles',
    contenido: 'Investigadores revelan una compleja red subterránea que permite a los árboles amazónicos comunicarse y compartir nutrientes entre sí. Este "internet del bosque" conecta árboles de diferentes especies a través de hongos micorrízicos, formando una red de comunicación y soporte mutuo.\n\nEl descubrimiento tiene implicaciones fundamentales para nuestra comprensión de los ecosistemas forestales. Los árboles más viejos actúan como "nodos centrales", distribuyendo nutrientes a árboles más jóvenes y compartiendo información sobre amenazas ambientales.\n\nEste hallazgo resalta la interconexión profunda del ecosistema amazónico y subraya la importancia de proteger bosques antiguos, que actúan como pilares fundamentales para la salud de todo el sistema forestal.',
    categoriaId: 'cat-flora',
    imagen: ['https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&h=400&fit=crop'],
    autorUid: 'usr-005',
    fechaCreacion: new Date('2025-11-02'),
    fechaActualizacion: new Date('2025-11-02'),
    estado: EstadoPublicacion.PUBLICADO
  },
  {
    id: 'not-012',
    titulo: 'Acuerdo Internacional Destina 200 Millones para Protección Amazónica',
    subtitulo: 'Fondo climático apoyará iniciativas de conservación',
    contenido: 'Un nuevo acuerdo internacional destinará 200 millones de dólares en los próximos cinco años para proyectos de conservación y desarrollo sostenible en la región amazónica. El fondo será administrado conjuntamente por gobiernos locales y organizaciones ambientales.\n\nLos recursos se enfocarán en tres áreas principales: protección de áreas críticas de biodiversidad, apoyo a comunidades indígenas en la gestión territorial, y desarrollo de alternativas económicas sostenibles que reduzcan la presión sobre los bosques.\n\nEste compromiso financiero representa uno de los esfuerzos de cooperación internacional más significativos para la protección amazónica y refleja el reconocimiento global de la importancia del bosque tropical para la estabilidad climática del planeta.',
    categoriaId: 'cat-clima',
    imagen: ['https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop'],
    autorUid: 'usr-001',
    fechaCreacion: new Date('2025-11-01'),
    fechaActualizacion: new Date('2025-11-01'),
    estado: EstadoPublicacion.PUBLICADO
  }
];
