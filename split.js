import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('index.html', 'utf8');
const $ = cheerio.load(html);

const getSectionHTML = (sel) => $.html($(sel));

const sections = {
    hero: getSectionHTML('.hero'),
    partners: getSectionHTML('.partners'),
    purpose: getSectionHTML('.purpose'),
    portfolio: getSectionHTML('.portfolio-switcher'),
    pricing: getSectionHTML('.tiered-pricing'),
    exclusive: getSectionHTML('.exclusive-partners'),
    ctaFireplace: getSectionHTML('.cta-fireplace'),
    blogPreview: getSectionHTML('.blog-preview'),
    statsBar: getSectionHTML('.stats-bar'),
    featureBrand: getSectionHTML('.feature-brand'),
    whyChooseUs: getSectionHTML('.why-choose-us'),
    testimonials: getSectionHTML('.testimonials-section'),
    legacy: getSectionHTML('.legacy-section'),
    refinedCta: getSectionHTML('.refined-cta'),
    milestones: getSectionHTML('.milestones'),
    contact: getSectionHTML('.contact-section'),
    faq: getSectionHTML('.faq-section')
};

// Rewrite the nav base
$('.nav-links').html(`
    <li><a href="index.html" data-page="index.html">Home</a></li>
    <li><a href="projects.html" data-page="projects.html">Projects</a></li>
    <li><a href="about.html" data-page="about.html">About</a></li>
    <li><a href="services.html" data-page="services.html">Services</a></li>
    <li><a href="contact.html" data-page="contact.html">Contact</a></li>
`);

const pages = {
    'index.html': { title: 'Home', sections: ['hero', 'partners', 'blogPreview', 'testimonials', 'refinedCta', 'faq'] },
    'projects.html': { title: 'Projects', sections: ['portfolio', 'exclusive'] },
    'about.html': { title: 'About', sections: ['statsBar', 'featureBrand', 'whyChooseUs', 'legacy', 'milestones'] },
    'services.html': { title: 'Services', sections: ['purpose', 'pricing'] },
    'contact.html': { title: 'Contact', sections: ['contact', 'ctaFireplace'] }
};

const baseHtml = $.html();

for (const [filename, config] of Object.entries(pages)) {
    const $page = cheerio.load(baseHtml);
    
    // Set title
    $page('title').text('Neo Studio | ' + config.title);
    
    // Set active nav link
    $page('.nav-links a').removeClass('active');
    $page('.nav-links a[data-page="' + filename + '"]').addClass('active');
    
    // Clear main content
    $page('main').empty();
    
    if (filename !== 'index.html') {
        $page('main').addClass('page-offset');
    } else {
        $page('main').removeClass('page-offset');
    }
    
    // Append sections
    for (const key of config.sections) {
        $page('main').append(sections[key]);
    }
    
    // Clean up
    $page('.nav-links a').removeAttr('data-page');

    fs.writeFileSync(filename, $page.html());
}

console.log('Pages created successfully.');
