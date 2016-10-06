export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.

    Make sure to define a factory for each model you want to create.
  */

  // server.createList('post', 10);
  server.createList('user', 5);
  server.createList('project', 5);
  server.createList('file', 5);
  server.createList('files', 4);
  server.createList('pricing',3);
  server.createList('vulnerability',10);
  server.createList('collaboration',5);
}
