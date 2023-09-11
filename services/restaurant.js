const restaurant = (db) => {

    async function getTables() {
        // get all the available tables
        let selectQuery = await db.many("SELECT * FROM table_booking")
        //console.log(selectQuery);
        return selectQuery;
        
    }

    async function bookTable({ tableRadio, userName, CellNo, NumberOfPeople }) {
        
        console.log("tableRadio:", tableRadio);
        console.log("userName:", userName);
        console.log("CellNo:", CellNo);
        console.log("NumberOfPeople:", NumberOfPeople);

        
      // book a table by name
      if (userName && NumberOfPeople && CellNo && tableRadio) {
        let selectQuery = await db.any(
          "SELECT table_name FROM table_booking WHERE table_name = $1",
          [tableRadio]
        );

        let tableQuery = await db.any(
          "SELECT capacity FROM table_booking WHERE table_name = $1",
          [selectQuery]
        );

        if (NumberOfPeople > tableQuery) {
          return "capacity greater than the table seats";
        }
      }
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