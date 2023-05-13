export default {
    props: {
        name: String,
        description: String,
        href: String
    },
    template: `
    <div class="row d-flex justify-content-center">
        <div class="test-container">
            <div class="category-info d-flex flex-row align-items-center">
                <div>
                    <div class="name">{{ name }}</div>
                    <div class="description">{{ description }}</div>
                </div>

                <a href="/category/<%= category.id %>/edit" style="margin: 10px;"><i class="fa fa-solid fa-chevron-right"></i></a>

            </div>

            <div class="icons">
                <a href=""><i class="fas fa-pen edit"></i></a>
                <a href=""><i class="fa fa-solid fa-trash delete"></i></a>
            </div>

        </div>
     </div>
    `
}
