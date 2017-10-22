exports.up = (knex, Promise) => Promise.all([
    knex.schema.createTable('product_types', table => {
        table.increments('id').primary()
            .comment('Sequential product type id');

        table.string('product_type').notNullable()
            .comment('Product type of product');

        table.string('name').notNullable()
            .comment('Product type name of Product');
        table.engine('InnoDB');
        table.charset('utf8');
        table.comment('Product Types');
    }),
    knex.schema.createTable('products', table => {
        table.string('product_id').notNullable().primary();
        table.integer('product_type_id').notNullable().unsigned().references('product_types.id');
        table.string('product_name').notNullable();
        table.integer('price').notNullable();
        table.string('image_url').notNullable();
        table.integer('quantity').notNullable();
        table.timestamp('created_at').notNullable()
            .defaultTo(knex.fn.now())
            .comment('Timestamp when the row was created');
        table.timestamp('updated_at').notNullable()
            .defaultTo(knex.fn.now())
            .comment('Timestamp when the row was updated');
        table.engine('InnoDB');
        table.charset('utf8');
        table.comment('Products Added');
    })
]);

exports.down = (knex, Promise) => knex.schema.table('products', column =>
    column.dropForeign('product_type_id'))
    .then(() => Promise.all([
        knex.schema.dropTableIfExists('product_types')
    ]));
