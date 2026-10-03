-- =============================================================================
-- Acota el estudio a Tierra del Fuego y suma seguros de vida, ahorro y
-- asistencia al viajero.
--
-- Corré esto en el SQL Editor de Supabase, después de schema.sql y seed.sql.
-- Es seguro: no borra nada, sólo agrega valores de enum, agrega los 3
-- productos de seguro nuevos, y actualiza las propiedades de EJEMPLO
-- (código MD-%) para que queden en Ushuaia en vez de todo el país. Si ya
-- cargaste propiedades reales, esto no las toca (no tienen código MD-%).
--
-- OJO: va en DOS pasos, en dos ejecuciones separadas. Postgres no deja usar
-- un valor de enum nuevo en la misma transacción en que se lo agrega
-- ("unsafe use of new value ... must be committed before they can be used").
-- =============================================================================

-- --- paso 1: nuevas familias de seguro (correr sola, después Run) -----------

alter type insurance_kind add value if not exists 'vida';
alter type insurance_kind add value if not exists 'ahorro';
alter type insurance_kind add value if not exists 'asistencia';

-- --- paso 2: correr todo lo de abajo junto, en una consulta nueva -----------

-- --- nuevos productos -----------------------------------------------------------

insert into insurance_products (slug, kind, name, description, detail, position) values
  ('seguro-de-vida',        'vida',       'Seguro de vida',
   'Protección económica para tu familia ante un imprevisto', 'SIN EXAMEN MÉDICO', 4),
  ('seguro-de-ahorro',      'ahorro',     'Seguro de ahorro',
   'Capitalizá a tu ritmo, con cobertura incluida',            'PLAZOS FLEXIBLES',  5),
  ('asistencia-al-viajero', 'asistencia', 'Asistencia al viajero',
   'Cobertura médica y de equipaje para tus viajes',           'VÁLIDA EN TODO EL MUNDO', 6)
on conflict (slug) do nothing;

-- --- propiedades de ejemplo: sólo Ushuaia ---------------------------------------

update properties set slug = 'casa-dos-plantas-jardin-san-jorge',      neighbourhood = 'San Jorge',         city = 'Ushuaia', province = 'Tierra del Fuego' where code = 'MD-0987';
update properties set slug = 'dos-ambientes-estrenar-centro',          neighbourhood = 'Centro',            city = 'Ushuaia', province = 'Tierra del Fuego' where code = 'MD-1149';
update properties set slug = 'ph-reciclado-sin-expensas-kaupen',       neighbourhood = 'Kaupen',            city = 'Ushuaia', province = 'Tierra del Fuego' where code = 'MD-1004';
update properties set slug = 'piso-luminoso-balcon-bahia-encerrada',   neighbourhood = 'Bahía Encerrada',   city = 'Ushuaia', province = 'Tierra del Fuego' where code = 'MD-1042';
update properties set slug = 'casa-patio-parrilla-don-bosco',          neighbourhood = 'Don Bosco',         city = 'Ushuaia', province = 'Tierra del Fuego' where code = 'MD-1121';
update properties set slug = 'monoambiente-amoblado-solar-del-bosque', neighbourhood = 'Solar del Bosque',  city = 'Ushuaia', province = 'Tierra del Fuego' where code = 'MD-1088';
update properties set slug = 'lote-barrio-cerrado-las-reinas',         neighbourhood = '',                  city = 'Ushuaia', province = 'Tierra del Fuego' where code = 'MD-1130';
update properties set slug = 'fraccion-acceso-asfaltado-tierra-mayor', neighbourhood = '',                  city = 'Ushuaia', province = 'Tierra del Fuego' where code = 'MD-1156';
update properties set slug = 'terreno-esquina-dos-frentes-chacra-ii',  neighbourhood = '',                  city = 'Ushuaia', province = 'Tierra del Fuego' where code = 'MD-1160';
update properties set slug = 'studio-vista-al-canal-playa-larga', title = 'Studio con vista al canal', neighbourhood = 'Playa Larga', city = 'Ushuaia', province = 'Tierra del Fuego' where code = 'MD-1190';
update properties set slug = 'casa-de-campo-para-seis-valle-de-lobos', neighbourhood = '',                  city = 'Ushuaia', province = 'Tierra del Fuego' where code = 'MD-1201';
update properties set slug = 'cabana-estufa-a-lena-valle-de-andorra',  neighbourhood = '',                  city = 'Ushuaia', province = 'Tierra del Fuego' where code = 'MD-1215';
update properties set slug = 'loft-reciclado-centro', title = 'Loft en edificio reciclado', neighbourhood = 'Centro', city = 'Ushuaia', province = 'Tierra del Fuego' where code = 'MD-1171';
update properties set slug = 'chalet-vista-al-canal-andorra', title = 'Chalet con vista al canal', neighbourhood = '', city = 'Ushuaia', province = 'Tierra del Fuego' where code = 'MD-1174';
