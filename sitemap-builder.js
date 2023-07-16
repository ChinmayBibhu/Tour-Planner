require("@babel/register")({
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: [
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                root: ["./src/"],
            }
        ]
        ]
    });


const router = require('./src/App').default;
const Sitemap = require('react-router-sitemap').default;

class UniqueSitemap extends Sitemap {
    constructor(router) {
        super(router);

        this.paths = this.paths.reduce(
            (acc, curr) => {
                if (!acc.includes(curr)) {
                    acc.push(curr);
                }

                return acc;
            },
            []
         );
    }
}

(
    new UniqueSitemap(router())
        .build('https://example.com')
        .save('./public/sitemap-index.xml')
);