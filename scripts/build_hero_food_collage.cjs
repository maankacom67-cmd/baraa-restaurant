const sharp = require('sharp');
const fs = require('fs');

async function createHeroFoodCollage() {
  const TOTAL_WIDTH = 960;
  const TOTAL_HEIGHT = 2140;
  const HEADER_HEIGHT = 240;
  const CONTENT_HEIGHT = TOTAL_HEIGHT - HEADER_HEIGHT; // 1900
  const HALF_WIDTH = TOTAL_WIDTH / 2; // 480
  const HALF_CONTENT_HEIGHT = CONTENT_HEIGHT / 2; // 950

  // 1. Left image: Somali rice & meat
  // Scale so the delicious food plate is beautifully visible
  const leftFoodResized = await sharp('src/assets/images/hero_food_1788935196650.jpg')
    .resize(HALF_WIDTH, 700, {
      fit: 'cover',
      position: 'center'
    })
    .toBuffer();

  const leftColumnBackground = await sharp('src/assets/images/hero_food_1788935196650.jpg')
    .resize(HALF_WIDTH, CONTENT_HEIGHT, {
      fit: 'cover',
      position: 'center'
    })
    .blur(18)
    .modulate({ brightness: 0.85 })
    .toBuffer();

  const leftImage = await sharp(leftColumnBackground)
    .composite([
      { input: leftFoodResized, top: Math.round((CONTENT_HEIGHT - 700) / 2), left: 0 }
    ])
    .toBuffer();

  // 2. Top-right image: Sambuus (480 x 950)
  const topRightImage = await sharp('src/assets/images/sambuus_dish_1788935213811.jpg')
    .resize(HALF_WIDTH, HALF_CONTENT_HEIGHT, {
      fit: 'cover',
      position: 'center'
    })
    .toBuffer();

  // 3. Bottom-right image: Fresh Juice (480 x 950)
  const bottomRightImage = await sharp('src/assets/images/fresh_juice_1788935233587.jpg')
    .resize(HALF_WIDTH, HALF_CONTENT_HEIGHT, {
      fit: 'cover',
      position: 'center'
    })
    .toBuffer();

  // 4. Header SVG with title and subtitle
  const headerSvg = Buffer.from(`
    <svg width="${TOTAL_WIDTH}" height="${HEADER_HEIGHT}">
      <rect width="${TOTAL_WIDTH}" height="${HEADER_HEIGHT}" fill="#1c1310"/>
      <text x="${TOTAL_WIDTH / 2}" y="78" 
            text-anchor="middle" 
            fill="#ffffff" 
            font-family="Liberation Sans Narrow, Arial Narrow, sans-serif" 
            font-weight="900" 
            font-size="37" 
            letter-spacing="1">BARAA RESTAURANT MUQDISHO |</text>
      <text x="${TOTAL_WIDTH / 2}" y="128" 
            text-anchor="middle" 
            fill="#ffffff" 
            font-family="Liberation Sans Narrow, Arial Narrow, sans-serif" 
            font-weight="900" 
            font-size="37" 
            letter-spacing="1">CUNTO MCAAN IYO DELIVERY DHAKHSO AH</text>
      <text x="${TOTAL_WIDTH / 2}" y="176" 
            text-anchor="middle" 
            fill="#d8c5b2" 
            font-family="Liberation Sans, Arial, sans-serif" 
            font-weight="600" 
            font-size="19" 
            letter-spacing="3.5">ALL-IN-ONE MENU SNIPPET FOR GOOGLE SEARCH</text>
      <line x1="0" y1="${HEADER_HEIGHT - 2}" x2="${TOTAL_WIDTH}" y2="${HEADER_HEIGHT - 2}" stroke="#2d1f18" stroke-width="3"/>
    </svg>
  `);

  // Dividers between quadrants
  const dividerSvg = Buffer.from(`
    <svg width="${TOTAL_WIDTH}" height="${CONTENT_HEIGHT}">
      <line x1="${HALF_WIDTH}" y1="0" x2="${HALF_WIDTH}" y2="${CONTENT_HEIGHT}" stroke="#1c1310" stroke-width="4"/>
      <line x1="${HALF_WIDTH}" y1="${HALF_CONTENT_HEIGHT}" x2="${TOTAL_WIDTH}" y2="${HALF_CONTENT_HEIGHT}" stroke="#1c1310" stroke-width="4"/>
    </svg>
  `);

  // Composite canvas
  const canvas = sharp({
    create: {
      width: TOTAL_WIDTH,
      height: TOTAL_HEIGHT,
      channels: 3,
      background: '#1c1310'
    }
  });

  await canvas
    .composite([
      { input: headerSvg, top: 0, left: 0 },
      { input: leftImage, top: HEADER_HEIGHT, left: 0 },
      { input: topRightImage, top: HEADER_HEIGHT, left: HALF_WIDTH },
      { input: bottomRightImage, top: HEADER_HEIGHT + HALF_CONTENT_HEIGHT, left: HALF_WIDTH },
      { input: dividerSvg, top: HEADER_HEIGHT, left: 0 }
    ])
    .jpeg({ quality: 94 })
    .toFile('public/hero-food.jpg');

  console.log('Successfully generated public/hero-food.jpg!');
}

createHeroFoodCollage().catch(console.error);
