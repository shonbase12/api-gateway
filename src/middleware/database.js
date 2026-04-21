const { MongoClient } = require('mongodb');
const uri = 'your_mongodb_connection_string'; // Replace with your MongoDB connection string

const client = new MongoClient(uri);

const getMerchantById = async (id) => {
    try {
        await client.connect();
        const database = client.db('your_database_name'); // Replace with your database name
        const merchants = database.collection('merchants'); // Replace with your collection name
        const merchant = await merchants.findOne({ id });
        return merchant || null;
    } catch (error) {
        console.error('Error fetching merchant by ID:', error);
        return null;
    } finally {
        await client.close();
    }
};

const getPlanByMerchantId = async (id) => {
    try {
        await client.connect();
        const database = client.db('your_database_name'); // Replace with your database name
        const plans = database.collection('plans'); // Replace with your collection name
        const plan = await plans.findOne({ merchantId: id });
        return plan ? plan.plan : null;
    } catch (error) {
        console.error('Error fetching plan by merchant ID:', error);
        return null;
    } finally {
        await client.close();
    }
};

module.exports = { getMerchantById, getPlanByMerchantId };