import config from "../config/elk_config.json";
import { Client } from "@elastic/elasticsearch";
import { connection } from "./db_mysql";
import { executeQuery } from "./db_mysql";

const elasticsearchConfig = config.elasticsearch;
const client = new Client(elasticsearchConfig);

async function sendDataToElk(id, data, indexName) {
  try {

    const searchResponse = await client.search({
      index: indexName,
      body: {
        query: {
          match: {
            _id: id, // Assuming your data object has an 'id' property
          },
        },
      },
    });
    if (searchResponse.body.hits.total.value > 0) {
      // Document with the specified ID already exists, update it
      const updateResponse = await client.update({
        index: indexName,
        id: id,
        body: {
          doc: data,  
        },
      });

      // console.log('Data updated:', updateResponse);
    } else {
      const response = await client.index({
        index: indexName,
        id: id,
        body: data,
      });
    }
    

    console.log(
      "--------####Data sent to Elasticsearch successfully!---------##"
    );
  } catch (error) {
    const intentData = JSON.stringify(data);
    connection.query('SELECT * FROM elkdata WHERE id = ?', [id], (error, results) => {
      if (error) {
        console.error('Error while searching for ID:', error);
        return;
      }
      if (results.length > 0) {
        for (const row of results) {
          const jsonObject1 = JSON.parse(row.data);
          const keys = Object.keys(jsonObject1);

            const numberOfPairsToDelete = 2;

            for (let i = keys.length - 1; i >= keys.length - numberOfPairsToDelete; i--) {
              const keyToDelete = keys[i];
              delete jsonObject1[keyToDelete];
            }

            Object.assign(jsonObject1, data);
            const combinedString = JSON.stringify(jsonObject1);
            console.log(combinedString)
            connection.query('UPDATE elkdata SET data=? WHERE id = ?', [combinedString, id], (updateError, updateResults) => {
              if (updateError) {
                console.error('Error while updating data:', updateError);
              } else {
                console.log('Data updated successfully:');
              }
            });
        }
        
      }
      else{
        const query = "INSERT INTO elkdata (id, data, indexName ) VALUES (?,?,?)";
        const values = [id, intentData, indexName];
        connection.query(query, values, (error, results) => {
          if (error) {
            console.error("Error logging ELK data:", error);
          } else {
            console.log("-------ELK data logged successfully!");
          }
        });
      }
    });
    

    // console.error("Error sending data to Elasticsearch:", error);
    console.error("------#Elasticsearch is down, make sure its running...");
  }
}

async function sendOfflineDataToElk() {
  try {
    const query = `SELECT * FROM elkdata`;
    const result = await executeQuery({ query });
    // console.log(result);

    for (const row of result) {
      const response1 = await client.index({
        index: row.indexName,
        id: row.id,
        body: row.data,
      });
    }

    const query1 = `DELETE FROM elkdata`;
    connection.query(query1, (error, results) => {});

    console.log(
      "--------####Data sent to Elasticsearch successfully!---------##"
    );
  } catch (error) {
    // console.error("Error sending data to Elasticsearch:", error);
    console.error("------#Elasticsearch is down, make sure its running...");
  }
}

module.exports ={sendDataToElk, sendOfflineDataToElk}