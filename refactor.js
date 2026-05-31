const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/HP/OneDrive/my project/name/mara/ej cuisine/versatile-pub-backend (2)/versatile-backend';

const replacements = [
  { regex: /Versatile Pub by Chef P/g, replace: 'Grillhouse' },
  { regex: /Versatile Pub/g, replace: 'Grillhouse' },
  { regex: /Chef P's Kitchen/g, replace: 'Grillhouse' },
  { regex: /Chef P/g, replace: 'Chef' },
  { regex: /17A Jemide Ave, GRA, Benin City/g, replace: '12 Victoria Island, Lagos' },
  { regex: /17A\+Jemide\+Ave\+GRA\+Benin\+City/g, replace: '12+Victoria+Island+Lagos' },
  { regex: /17A Jemide Ave GRA Benin City/g, replace: '12 Victoria Island, Lagos' },
  { regex: /17A Jemide Ave/g, replace: '12 Victoria Island' },
  { regex: /17A Jemide/g, replace: '12 Victoria Island' },
  { regex: /0905 215 5013/g, replace: '0800 123 4567' },
  { regex: /09052155013/g, replace: '08001234567' },
  { regex: /@chefp_kitchen_catering/g, replace: '@grillhouselagos' },
  { regex: /Benin City/g, replace: 'Lagos' },
  { regex: /GRA/g, replace: 'Victoria Island' },
  { regex: /https:\/\/images\.unsplash\.com\/photo-1568901346375-23c9450c58cd\?w=1600&q=80/g, replace: './grillhouse-hero.png' },
  { regex: /https:\/\/images\.unsplash\.com\/photo-1414235077428-338989a2e8c0\?w=1200&q=60/g, replace: './grillhouse-bg.jpg' },
  { regex: /https:\/\/images\.unsplash\.com\/photo-1555396273-367ea4eb4db5\?w=800&q=80/g, replace: './grillhouse-bg.jpg' },
  { regex: /<span id="orderingDisabledMsg">Online ordering is currently unavailable\. Please call us to place your order\.<\/span>/g, replace: '' }
];

function walk(dir) {
  let results = [];
  if(!fs.existsSync(dir)) return [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      if (!file.includes('node_modules')) results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.html') || file.endsWith('.js')) results.push(file);
    }
  });
  return results;
}

const files = walk(dir);
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  replacements.forEach(r => {
    content = content.replace(r.regex, r.replace);
  });
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated: ' + f);
  }
});
console.log('Processed ' + files.length + ' files. Done.');
