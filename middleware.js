async function getAuditData(startDateString, endDateString, userId) {
    const query = `SELECT UserId, Username, IntentName, FinalResponse, FlowDefinition, IntentData, createddate FROM auditdata WHERE createddate >= ? AND createddate <= ? AND UserId = ?`;
    const values = [startDateString, endDateString, userId];
    const result = await executeQuery({ query, values });
    return result;
  }

  async function getAuditData(startDateString, endDateString, userId) {
    const query = `SELECT UserId, Username, IntentName, FinalResponse, FlowDefinition, IntentData, createddate FROM auditdata WHERE createddate >= ? AND createddate <= ? AND UserId = ?`;
    const values = [startDateString, endDateString, userId];
    const result = await executeQuery({ query, values });
    return result;
  }