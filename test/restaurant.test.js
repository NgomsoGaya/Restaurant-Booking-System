import assert from "assert"
import RestaurantTableBooking from "../services/restaurant.js";
import pgPromise from 'pg-promise';

const DATABASE_URL =
  "postgres://nrctmphn:s45gJviodAqi86B2Wth1bx5JWzeC-NbO@dumbo.db.elephantsql.com/nrctmphn";

const connectionString = process.env.DATABASE_URL || DATABASE_URL;
const db = pgPromise()(connectionString);

describe("The restaurant booking table", function () {
    beforeEach(async function () {
        try {
            // clean the tables before each test run
            //await db.none("TRUNCATE TABLE table_booking RESTART IDENTITY CASCADE;");
        } catch (err) {
            console.log(err);
            throw err;
        }
    });

    it("Get all the available tables", async function () {
        const restaurantTableBooking = RestaurantTableBooking(db);

        assert.deepEqual(
          [
            {
              booked: false,
              capacity: 4,
              contact_number: null,
              id: 1,
              number_of_people: null,
              table_name: "Table one",
              username: null,
            },
            {
              booked: false,
              capacity: 6,
              contact_number: null,
              id: 2,
              number_of_people: null,
              table_name: "Table two",
              username: null,
            },
            {
              booked: false,
              capacity: 4,
              contact_number: null,
              id: 3,
              number_of_people: null,
              table_name: "Table three",
              username: null,
            },
            {
              booked: false,
              capacity: 2,
              contact_number: null,
              id: 4,
              number_of_people: null,
              table_name: "Table four",
              username: null,
            },
            {
              booked: false,
              capacity: 6,
              contact_number: null,
              id: 5,
              number_of_people: null,
              table_name: "Table five",
              username: null,
            },
            {
              booked: false,
              capacity: 4,
              contact_number: null,
              id: 6,
              number_of_people: null,
              table_name: "Table six",
              username: null,
            },
          ],
          await restaurantTableBooking.getTables()
        );
    });


    it("It should check if the capacity is not greater than the available seats.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);

        const result = await restaurantTableBooking.bookTable({
            tableRadio: 'Table four',
            userName: 'Kim',
            CellNo: '084 009 8910',
            NumberOfPeople: 3
        });

        assert.deepEqual("capacity greater than the table seats", result);
    });

    it("should check if there are available seats for a booking.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);

        // get all the tables

        // loop over the tables and see if there is a table that is not booked

        assert.deepEqual(true, false);
    });

    it("Check if the booking has a user name provided.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);
        assert.deepEqual(
          "Please enter a username",
          await restaurantTableBooking.bookTable({
            tableRadio: "Table eight",
            CellNo: "084 009 8910",
            NumberOfPeople: 2,
          })
        );
    });

    it("Check if the booking has a contact number provided.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);
        assert.deepEqual(
          "Please enter a contact number",
          await restaurantTableBooking.bookTable({
            tableRadio: "Table eight",
            userName: "Kim",
            NumberOfPeople: 2,
          })
        );
    });

    it("should not be able to book a table with an invalid table name.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);

        await restaurantTableBooking.bookTable({
          tableRadio: "Table eight",
          userName: "Kim",
          CellNo: "084 009 8910",
          tableRadio: 2,
        });

        assert.deepEqual("Invalid table name provided", message);
    });

    it("should be able to book a table.", async function () {
        let restaurantTableBooking = RestaurantTableBooking(db);
        // Table three should not be booked
        assert.equal(true, await restaurantTableBooking.isTableBooked('Table three'));
        // book Table three

        await restaurantTableBooking.bookTable({
            tableName: 'Table three',
            username: 'Kim',
            phoneNumber: '084 009 8910',
            seats: 2
        });

        // Table three should be booked now
        const booked = await restaurantTableBooking.isTableBooked('Table three')
        assert.equal(true, booked);
    });

    it("should list all booked tables.", async function () {
        let restaurantTableBooking = RestaurantTableBooking(db);
        let tables = await restaurantTableBooking.getTables();
        assert.deepEqual(6, tables.length);
    });

    it("should allow users to book tables", async function () {
        let restaurantTableBooking = await RestaurantTableBooking(db);

        assert.deepEqual([], await restaurantTableBooking.getBookedTablesForUser('jodie'));
        
        restaurantTableBooking.bookTable({
            tableName: 'Table five',
            username: 'Jodie',
            phoneNumber: '084 009 8910',
            seats: 4
        });

        restaurantTableBooking.bookTable({
            tableName: 'Table four',
            username: 'Jodie',
            phoneNumber: '084 009 8910',
            seats: 2
        });

        await restaurantTableBooking.bookTable({
            tableName: 'Table five',
            username: 'Jodie',
            phoneNumber: '084 009 8910',
            seats: 4
        })

        // should only return 2 bookings as two of the bookings were for the same table
        assert.deepEqual([{}, {}], await restaurantTableBooking.getBookedTablesForUser('jodie'));
    });

    it("should be able to cancel a table booking", async function () {
        let restaurantTableBooking = await RestaurantTableBooking(db);

        await restaurantTableBooking.bookTable({
            tableName: 'Table five',
            username: 'Jodie',
            phoneNumber: '084 009 8910',
            seats: 4
        });

        restaurantTableBooking.bookTable({
            tableName: 'Table four',
            username: 'Kim',
            phoneNumber: '084 009 8910',
            seats: 2
        });

        let bookedTables = await restaurantTableBooking.getBookedTables();
        assert.equal(2, bookedTables.length);

        await restaurantTableBooking.cancelTableBooking("Table four");

        bookedTables = await restaurantTableBooking.getBookedTables();
        assert.equal(1, bookedTables.length);
    });

    after(function () {
        db.$pool.end;
    });
})
