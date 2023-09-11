const restaurant = (db) => {

    async function getTables() {
        // get all the available tables
        let selectQuery = await db.many("SELECT * FROM table_booking")
      //console.log(selectQuery);
      
        return selectQuery;
        
    }

    async function bookTable({ tableRadio, userName, CellNo, NumberOfPeople }) {
        
        // console.log("tableRadio:", tableRadio);
        // console.log("userName:", userName);
        // console.log("CellNo:", CellNo);
        // console.log("NumberOfPeople:", NumberOfPeople);

      let errorCapacity = "capacity greater than the table seats";
      let userNameError = "Please enter a username";
      let cellNoError = "Please enter a contact number";
      let invalidTable = "Table does not exist";
      // book a table by name
      if (userName && NumberOfPeople && CellNo && tableRadio) {
        let selectQuery = await db.any(
          "SELECT table_name FROM table_booking WHERE table_name = $1",
          [tableRadio]
        );

        let tableQuery = await db.any(
          "SELECT capacity FROM table_booking WHERE table_name = $1",
          [selectQuery.table_name]
        );

        if (NumberOfPeople > tableQuery) {
          return errorCapacity;
        }
        else if (NumberOfPeople <= tableQuery) {

          await db.any( "UPDATE table_booking SET booked = true WHERE table_name = selectQuery.table_name")
        }
      }

      if (!userName) {
        return userNameError;
      }
      if (!CellNo) {
        return cellNoError;
      }
      if(tableRadio !== "SELECT table_name FROM table_booking")
      return invalidTable
    }

    async function getBookedTables() {
      // get all the booked tables
      
    }

    async function isTableBooked(tableName) {
        // get booked table by name
    }

    async function cancelTableBooking(tableName) {
        // cancel a table by name
    }

    async function getBookedTablesForUser(username) {
        // get user table booking
    }

    return {
        getTables,
        bookTable,
        getBookedTables,
        isTableBooked,
        cancelTableBooking,
        //editTableBooking,
        getBookedTablesForUser
    }
}

export default restaurant;