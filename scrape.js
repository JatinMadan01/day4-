const axios = require('axios');
const cheerio = require('cheerio');
const ExcelJS = require('exceljs');

const url = 'https://www.nike.com/in/';

async function scrapeData() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Products');

        worksheet.columns = [
            { header: 'Product Name', key: 'name', width: 30 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Availability', key: 'availability', width: 20 },
            { header: 'Rating', key: 'rating', width: 10 }
        ];

        $('.product').each((i, element) => {
            const name = $(element).find('.product-name').text().trim();
            const price = $(element).find('.product-price').text().trim();
            const availability = $(element).find('.product-availability').text().trim();
            const rating = $(element).find('.product-rating').text().trim() || 'N/A';

            worksheet.addRow({
                name,
                price,
                availability,
                rating
            });
        });
        await workbook.xlsx.writeFile('products.xlsx');
        console.log('Data has been written to products.xlsx');
    } catch (error) {
        console.error('Error occurred while scraping:', error);
    }
}

scrapeData();
