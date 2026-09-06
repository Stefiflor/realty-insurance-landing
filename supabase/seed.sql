-- =============================================================================
-- Datos de ejemplo
--
-- Correlo DESPUÉS de schema.sql para ver el sitio funcionando con la base
-- conectada. Son las mismas propiedades inventadas que usan las fixtures.
--
-- OJO: NO son datos reales del estudio. Cuando Matías cargue sus propiedades,
-- borrá estas con:
--   delete from properties where code like 'MD-%';
-- =============================================================================

-- --- coberturas --------------------------------------------------------------

insert into insurance_products (slug, kind, name, description, detail, position) values
  ('seguro-de-hogar',      'hogar',          'Seguro de hogar',
   'Incendio, robo, daños por agua y cristales',   'PROPIETARIOS E INQUILINOS', 0),
  ('garantia-de-alquiler', 'garantia',       'Garantía de alquiler',
   'Reemplaza al garante propietario',             'APROBACIÓN EN 48 H',        1),
  ('responsabilidad-civil','responsabilidad','Responsabilidad civil',
   'Daños a terceros y linderos',                  'EXIGIDO EN CONSORCIOS',     2),
  ('obra-y-construccion',  'construccion',   'Obra y construcción',
   'Cobertura durante la obra en terreno propio',  'TODO RIESGO CONSTRUCTIVO',  3)
on conflict (slug) do nothing;

-- --- propiedades -------------------------------------------------------------
-- El seguro se referencia por slug con un subselect, así el orden de inserción
-- no importa y no hay que copiar UUIDs a mano.

insert into properties (
  code, slug, title, description, operation, kind, state,
  price_amount, price_currency, price_period,
  neighbourhood, city, province,
  rooms, bedrooms, bathrooms, covered_area, total_area, area_unit, floor,
  has_parking, highlights, insurance_product_id, featured
) values

-- venta
('MD-0987', 'casa-dos-plantas-jardin-martinez', 'Casa de dos plantas con jardín',
 'Casa en dos plantas sobre lote propio, con jardín al frente y fondo con pileta. Living comedor con hogar a leña, cocina independiente y toilette en planta baja. Arriba, cuatro dormitorios y dos baños completos.',
 'venta', 'casa', 'publicado',
 189000, 'USD', 'unico', 'Martínez', 'San Isidro', 'Buenos Aires',
 5, 4, 3, 210, 380, 'm2', null, true, array['Pileta','Jardín','Hogar a leña'],
 (select id from insurance_products where slug = 'seguro-de-hogar'), true),

('MD-1149', 'dos-ambientes-estrenar-rosario', 'Dos ambientes a estrenar',
 'Unidad a estrenar en edificio con amenities. Cocina integrada al living, dormitorio en suite y balcón con vista abierta. Apto profesional.',
 'venta', 'departamento', 'publicado',
 96500, 'USD', 'unico', 'Centro', 'Rosario', 'Santa Fe',
 2, 1, 1, 52, null, 'm2', 7, false, array['Amenities','A estrenar'],
 (select id from insurance_products where slug = 'seguro-de-hogar'), true),

('MD-1004', 'ph-reciclado-sin-expensas-caballito', 'PH reciclado sin expensas',
 'PH al frente completamente reciclado, sin expensas. Tres ambientes con terraza propia de uso exclusivo. Instalaciones nuevas.',
 'venta', 'ph', 'publicado',
 134000, 'USD', 'unico', 'Caballito', 'CABA', 'CABA',
 3, 2, 1, 88, null, 'm2', null, false, array['Terraza','Sin expensas','Reciclado'],
 null, true),

-- alquiler
('MD-1042', 'piso-luminoso-balcon-palermo', 'Piso luminoso con balcón corrido',
 'Departamento de dos ambientes con balcón corrido a la calle. Muy luminoso, orientación norte. Edificio con encargado permanente.',
 'alquiler', 'departamento', 'publicado',
 340000, 'ARS', 'mes', 'Palermo Soho', 'CABA', 'CABA',
 2, 1, 1, 58, null, 'm2', 3, false, array['Balcón corrido','Orientación norte'],
 (select id from insurance_products where slug = 'garantia-de-alquiler'), true),

('MD-1121', 'casa-patio-parrilla-devoto', 'Casa con patio y parrilla',
 'Casa de cuatro ambientes con patio, parrilla y cochera cubierta. Ideal familia. A tres cuadras de la plaza.',
 'alquiler', 'casa', 'publicado',
 615000, 'ARS', 'mes', 'Villa Devoto', 'CABA', 'CABA',
 4, 3, 2, 140, 200, 'm2', null, true, array['Cochera','Parrilla','Patio'],
 (select id from insurance_products where slug = 'seguro-de-hogar'), true),

('MD-1088', 'monoambiente-amoblado-nueva-cordoba', 'Monoambiente amoblado',
 'Monoambiente completamente amoblado y equipado, listo para entrar. Edificio con laundry y terraza común.',
 'alquiler', 'estudio', 'publicado',
 228000, 'ARS', 'mes', 'Nueva Córdoba', 'Córdoba', 'Córdoba',
 1, null, 1, 34, null, 'm2', 8, false, array['Amoblado','Laundry'],
 null, true),

-- terrenos
('MD-1130', 'lote-barrio-cerrado-pilar', 'Lote en barrio cerrado',
 'Lote interno en barrio cerrado con seguridad 24 horas. Todos los servicios en el frente. Escritura inmediata.',
 'terreno', 'lote', 'publicado',
 62000, 'USD', 'unico', '', 'Pilar', 'Buenos Aires',
 null, null, null, null, 800, 'm2', null, false, array['Servicios','Escritura','Seguridad 24h'],
 (select id from insurance_products where slug = 'obra-y-construccion'), true),

('MD-1156', 'fraccion-acceso-asfaltado-carlos-paz', 'Fracción con acceso asfaltado',
 'Fracción de cuatro hectáreas con acceso asfaltado hasta el portón. Alambrado perimetral y perforación de agua.',
 'terreno', 'campo', 'publicado',
 240000, 'USD', 'unico', '', 'Carlos Paz', 'Córdoba',
 null, null, null, null, 4, 'ha', null, false, array['Agua','Alambrado','Acceso asfaltado'],
 null, true),

('MD-1160', 'terreno-esquina-dos-frentes-funes', 'Terreno esquina con dos frentes',
 'Lote en esquina con dos frentes, apto para dúplex. Luz y gas en la línea municipal.',
 'terreno', 'lote', 'publicado',
 38500, 'USD', 'unico', '', 'Funes', 'Santa Fe',
 null, null, null, null, 450, 'm2', null, false, array['Luz y gas','Apto dúplex','Esquina'],
 (select id from insurance_products where slug = 'obra-y-construccion'), true),

-- temporario
('MD-1190', 'studio-vista-al-rio-puerto-madero', 'Studio con vista al río',
 'Studio en torre con amenities y vista directa al río. Wi-Fi de fibra, ropa blanca incluida. Estadía mínima tres noches.',
 'temporario', 'departamento', 'publicado',
 62, 'USD', 'noche', 'Puerto Madero', 'CABA', 'CABA',
 1, null, 1, 42, null, 'm2', 14, false, array['Wi-Fi','Vista al río','Amenities'],
 (select id from insurance_products where slug = 'seguro-de-hogar'), true),

('MD-1201', 'casa-de-campo-para-seis-tandil', 'Casa de campo para seis',
 'Casa de campo con parque, parrilla y galería. Tres dormitorios, capacidad para seis personas. A quince minutos del centro.',
 'temporario', 'casa', 'publicado',
 140, 'USD', 'noche', '', 'Tandil', 'Buenos Aires',
 null, 3, 2, 160, 2000, 'm2', null, true, array['Parque','Parrilla','Galería'],
 (select id from insurance_products where slug = 'seguro-de-hogar'), true),

('MD-1215', 'cabana-estufa-a-lena-villa-la-angostura', 'Cabaña con estufa a leña',
 'Cabaña de montaña con estufa a leña y deck con vista al bosque. Dos dormitorios, cocina completa.',
 'temporario', 'cabana', 'publicado',
 88, 'USD', 'noche', '', 'Villa La Angostura', 'Neuquén',
 null, 2, 1, 75, null, 'm2', null, false, array['Deck','Estufa a leña','Vista al bosque'],
 null, true),

-- Un par sin publicar, para ver los estados en el panel cuando exista.
('MD-1171', 'loft-ex-fabrica-barracas', 'Loft en ex fábrica reciclada',
 'Loft en ex fábrica reciclada, doble altura y ventanales originales.',
 'alquiler', 'departamento', 'borrador',
 410000, 'ARS', 'mes', 'Barracas', 'CABA', 'CABA',
 2, 1, 1, 95, null, 'm2', null, false, array['Doble altura'],
 null, false),

('MD-1174', 'chalet-vista-sierra-la-cumbre', 'Chalet con vista a la sierra',
 'Chalet de piedra con vista abierta a la sierra.',
 'venta', 'casa', 'revision',
 155000, 'USD', 'unico', '', 'La Cumbre', 'Córdoba',
 4, 3, 2, 180, 900, 'm2', null, true, array['Vista a la sierra'],
 null, false)

on conflict (code) do nothing;
