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
      let bookedTables = await db.any("SELECT table_name FROM table_booking WHERE booked = $1",
      [true])

      return bookedTables
    }

    async function isTableBooked(tableName) {
      // get booked table by name
      let isBooked = await db.any(
        "SELECT booked FROM table_booking"
      );
      isBooked.forEach(element => {
        if (element == false) {
          return element
        } else if(element == true){
          return "is booked"
        }
      });
    }

    async function cancelTableBooking(tableName) {
        // cancel a table by name
    }

    async function getBookedTablesForUser(username) {
      // get user table booking
      let tables = await db.any("SELECT * FROM table_booking");
      tables.forEach((element) => {
        if (element.booked == false) {
          return "Is not booked";
        } else if (element.booked == true) {
          return element;
        }
      });
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