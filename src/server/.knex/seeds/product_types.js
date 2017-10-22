function deconstrain(trx, knexCall) {
    // https://github.com/tgriesser/knex/issues/218#issuecomment-56686210
    return trx
        .raw('SET foreign_key_checks = 0')
        .then(knexCall)
        . finally(() => trx.raw('SET foreign_key_checks = 1'))
};

exports.seed = (knex, Promise) => knex.transaction(trx =>
    deconstrain(trx,
        // Deletes ALL existing entries
        () => trx('product_types').del()
            .then(() =>
                Promise.all([
                    // Inserts seed entries
                    trx.insert(
                        {id: 1, product_type: 'tv', name: 'Television'}
                    ).into('product_types'),
                    trx.insert(
                        {id: 2, product_type: 'fridge', name: 'Refrigerator'}
                    ).into('product_types'),
                    trx.insert(
                        {id: 3, product_type: 'ac', name: 'Air Conditioner'}
                    ).into('product_types'),
                    trx.insert(
                        {id: 4, product_type: 'washingmachine', name: 'Washing Machine'}
                    ).into('product_types'),
                ])
            ))
);

