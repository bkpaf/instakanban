export default class KanbanAPI {
  static getItems(columnId) {
    const column = read().find((column) => column.id == columnId);

    if (!column) {
      return [];
    }

    return column.items;
  }

  static insertItem(columnId, content) {
    const data = read();
    const column = data.find((column) => column.id == columnId);
    const item = {
      id: Math.floor(Math.random() * 100000),
      content,
    };

    if (!column) {
      throw new Error("Column does not exist.");
    }

    column.items.push(item);
    save(data);

    return item;
  }

  static updateItem(itemId, newProps) {
    const data = read();
    const [item, currentColumn] = (() => {
      for (const column of data) {
        const item = column.items.find((item) => item.id == itemId);
        if (item) {
          return [item, column];
        }
      }
    })();

    if (!item) {
      throw new Error("Item not found.");
    }

    item.content =
      newProps.content === undefined ? item.content : newProps.content;

    // Update column and position
    if (newProps.columnId !== undefined && newProps.position !== undefined) {
      const targetColumn = data.find(
        (column) => column.id == newProps.columnId
      );

      if (!targetColumn) {
        throw new Error("Target column not found.");
      }

      // Delete the item from it's current column
      currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

      // Move item into it's new column and position
      targetColumn.items.splice(newProps.position, 0, item);
    }

    save(data);
  }

  static deleteItem(itemId) {
    const data = read();

    for (const column of data) {
      const item = column.items.find((item) => item.id == itemId);

      if (item) {
        column.items.splice(column.items.indexOf(item), 1);
      }
    }

    save(data);
  }
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1onBcGDyXqgSf3fw8pu-a6zPmnJF6Woo",
  authDomain: "jsd13-pf-final-project.firebaseapp.com",
  projectId: "jsd13-pf-final-project",
  databaseURL:
    "https://jsd13-pf-final-project-default-rtdb.europe-west1.firebasedatabase.app/",
  storageBucket: "jsd13-pf-final-project.appspot.com",
  messagingSenderId: "692623946750",
  appId: "1:692623946750:web:10e72f27bae7445e2706af",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

function read() {
  //const json = localStorage.getItem("kanban-data");
  const json = getItems();
  if (!json) {
    return [
      {
        id: 1,
        items: [],
      },
      {
        id: 2,
        items: [],
      },
      {
        id: 3,
        items: [],
      },
    ];
  }

  return JSON.parse(json);
}

function getItems() {
  db.ref(`kanbanData`).on("value", function (results) {
    return results.val();
  });
}

function save(data) {
  const kanbanDataRef = db.ref(`kanbanData`);
  kanbanDataRef.child("kanban-data").set(JSON.stringify(data));
}
