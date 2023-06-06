// const path = require('path');

module.exports = {
  title: require('./package.json').name,
  components: 'src/components/**/[A-Z]*.js',
  sections: [
    {
      name: 'Pages',
      components: 'src/pages/**/[A-Z]*.js',
      ignore: [
        'src/pages/ActiveAssessments/ActiveAssessmentsFilter.js',
        'src/pages/ActiveAssessments/PreviousAssessmentsTable.js',
        'src/pages/Assessment/AssessmentsList.js',
        'src/pages/Assessment/CurrentAssessment.js',
        'src/pages/Assessment/Pillar.js',
        'src/pages/Assessment/PredefinedEvidences.js',
        'src/pages/Assessment/Question.js',
        'src/pages/Assessment/Section.js',
        'src/pages/Campaign/AssessmentTypes.js',
        'src/pages/Campaign/CampaignEntities.js',
        'src/pages/Campaign/NewCampaignConfiguration.js',
        'src/pages/Campaign/Assessors.js',
        'src/pages/Home/Home.js',
        'src/pages/Login/LoginAuth.js',
        'src/pages/Thanks/Thanks.js',
      ],
    },
    {
      name: 'Generic UI components',
      components: 'src/components/**/[A-Z]*.js',
      ignore: [
        'src/components/Assessment/Questions/QuestionContent.js',
        'src/components/Evidence/EvidenceDetails.js',
      ],
    },
  ],
  webpackConfig: {
    module: {
      rules: [
        // Babel loader, will use your project’s .babelrc
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        // Other loaders that are needed for your components
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader?modules',
        },
        // {
        //   test: /\.css$/,
        //   loader: ['style-loader', 'css-loader'],
        // },
      ],
    },
  },
  serverPort: 7000,
};
