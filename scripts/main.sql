INSERT INTO tbl_categories (id, name, status, created_at, description)
VALUES
    ('2f0a1783-137d-46c8-83b9-becfa29f440e', 'Smartphone', true, '2025-07-19 01:22:53.340857+00', 'Teléfonos móviles y smartphones'),
    ('a72a2ab1-be28-4583-9225-a5f23a556eaa', 'Computadoras y Portátiles', true, '2025-07-19 01:22:53.340857+00', 'Computadoras de escritorio, portátiles y dispositivos relacionados'),
    ('6404cf02-0e39-477b-adfc-138c76d8b7ea', 'Gaming', true, '2025-07-19 01:22:53.340857+00', 'Consolas de videojuegos y accesorios'),
    ('54690b35-0610-4cc3-82ad-b2a49268c454', 'Tabletas', true, '2025-07-19 01:22:53.340857+00', 'Tabletas y lectores electrónicos'),
    ('a54a926f-f4a4-44ca-bf8d-71b2fa74ac62', 'Audio', true, '2025-07-19 01:22:53.340857+00', 'Auriculares, altavoces y dispositivos de audio'),
    ('8a8ee76f-9ccb-45dd-a37c-77a2039b68fa', 'Cámaras', true, '2025-07-19 01:22:53.340857+00', 'Cámaras digitales y equipos de fotografía'),
    ('6bf4dd25-8f3a-41f2-a8d7-6eab3db25ab2', 'Electrodomésticos', true, '2025-07-19 01:22:53.340857+00', 'Electrodomésticos inteligentes y de cocina'),
    ('05307399-f12e-491c-b25c-6e6e2a298e6e', 'Redes', true, '2025-07-19 01:22:53.340857+00', 'Routers, módems y dispositivos de red'),
    ('a2b4490f-095b-4798-8a5c-51a0078591c8', 'Accesorios', true, '2025-07-19 01:22:53.340857+00', 'Accesorios y periféricos para dispositivos');

INSERT INTO tbl_products (category_id, name, stock, description, price, image_url)
VALUES
    ('2f0a1783-137d-46c8-83b9-becfa29f440e', 'iPhone 15 Pro', 50, 'Apple iPhone 15 Pro 128GB', 4999000, 'https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-hero-230912_Full-Bleed-Image.jpg.large.jpg'),
    ('a72a2ab1-be28-4583-9225-a5f23a556eaa', 'Dell XPS 13', 30, 'Dell XPS 13 Laptop 16GB RAM', 3999000, 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9350/spi/platinum/oled/notebook-xps-13-9350-oled-silver-campaign-hero-504x350-ng.psd?fmt=jpg&hei=400&wid=570'),
    ('6404cf02-0e39-477b-adfc-138c76d8b7ea', 'PlayStation 5', 20, 'Sony PlayStation 5 Digital Edition', 2199000, 'https://media.direct.playstation.com/is/image/sierialto/PS5-Digital-Slim-Hero-Box-and-console-US-V2'),
    ('54690b35-0610-4cc3-82ad-b2a49268c454', 'iPad Air', 40, 'Apple iPad Air 10.9"', 2599000, 'https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-color-lineup-230912_big.jpg.large.jpg'),
    ('a54a926f-f4a4-44ca-bf8d-71b2fa74ac62', 'Sony WH-1000XM5', 60, 'Auriculares inalámbricos con cancelación de ruido', 1399000, 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg'),

