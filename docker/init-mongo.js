db.createUser(
    {
        user: "dylan",
        pwd: "interview",
        roles: [
            {
                role: "readWrite",
                db: "hydrogen"
            }
        ]
    }
)