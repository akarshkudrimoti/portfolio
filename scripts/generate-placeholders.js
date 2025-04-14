const fs = require('fs');
const { createCanvas } = require('canvas');

// Create images directory if it doesn't exist
if (!fs.existsSync('./public/images')) {
  fs.mkdirSync('./public/images', { recursive: true });
}

// Function to create a placeholder image
function createPlaceholder(filename, title, color) {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Add title
  ctx.fillStyle = color;
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, width / 2, height / 2);

  // Add placeholder text
  ctx.font = '24px monospace';
  ctx.fillText('Project Image Placeholder', width / 2, height / 2 + 50);

  // Save the image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(`./public/images/${filename}`, buffer);
  console.log(`Created ${filename}`);
}

// Create placeholders for each project
createPlaceholder('fraction-dash.jpg', 'Fraction Dash', '#00ff00');
createPlaceholder('snake-ai.jpg', 'Snake AI', '#00ff00');
createPlaceholder('robotics-frc.jpg', 'STORM Robotics FRC', '#00ff00');

console.log('All placeholder images created successfully!'); 