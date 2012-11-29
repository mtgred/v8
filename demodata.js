products = [
  {name: 'Karlsfors', category: 'Sofas', shortDescription: 'Two-seat sofa, tufted, Grann white', description: 'Seat surfaces in soft, hardwearing and easy care grain leather which ages gracefully.', price: 495, },
  {name: 'Klippan', category: 'Sofas', shortDescription: 'Two-seat sofa, Skinnarp white', description: 'Easy to keep clean; wipe with a sponge damped with water or a mild detergent.', price: 175, },
  {name: 'Sater', category: 'Sofas', shortDescription: '2.5-seat sofa, Fräsig dark brown', description: 'Durable, easy care split leather; practical for families with children.', price: 275, },
  {name: 'Stockholm', category: 'Sofas', shortDescription: 'Three-seat sofa, Elegant dark brown', description: 'Heavy, easy care leather that ages gracefully. Seat cushion with waterfowl feathers and high resilience foam which moulds itself to your body and regains its shape when you stand up - equally comfortable day after day.', price: 1350, },
  {name: 'Bjursta', category: 'Tables', shortDescription: 'Dining table, brown-black', description: 'Extendable dining table with 2 extra leaves seats 6-10; makes it possible to adjust the table size according to need.', price: 190, },
  {name: 'Stornäs', category: 'Tables', shortDescription: 'Dining table, antique stain', description: 'Extendable dining table with 2 extra leaves seats 6-10; makes it possible to adjust the table size according to need.', price: 300, },
  {name: 'Malm', category: 'Beds', shortDescription: 'Bed frame with slatted bed base, white stained oak', description: 'Adjustable bed sides; allow you to use mattresses of different thicknesses.', price: 125, },
  {name: 'Folldal', category: 'Beds', shortDescription: 'Bed frame with slatted bed base, Grann white', description: 'Soft, hardwearing and easy care leather, which ages gracefully. ', price: 600, },
  {name: 'Oppdal', category: 'Beds', shortDescription: 'Bed frame w storage+slatted bedbase, medium brown', description: 'The four drawers in the bed frame gives you lots of storage space.', price: 265, },
  {name: 'Hemnes', category: 'Beds', shortDescription: 'Bed frame with slatted bed base, grey-brown', description: 'Adjustable bed sides; allow you to use mattresses of different thicknesses.', price: 200, },
  {name: 'Billy', category: 'Shelves', shortDescription: 'Bookcase, birch veneer', description: '', price: 145, },
  {name: 'Borgsjö', category: 'Shelves', shortDescription: 'Bookcase, white', description: 'The lower part of the bookcase has built-in cable management for collecting cables and cords; out of sight but close at hand.', price: 55, },
];

db.products.remove();
db.products.insert(products);
