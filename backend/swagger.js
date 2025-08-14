const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Health Tracker API',
      version: '1.0.0',
      description:
        'REST API for user registration/authentication, calorie intake logging, workout management, dashboard summaries, and personalized health insights.',
      contact: { name: 'API Support', email: 'support@example.com' },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide a valid JWT token in the Authorization header as Bearer token',
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Service health' },
      { name: 'Auth', description: 'User authentication and profile' },
      { name: 'Calories', description: 'Calorie intake logging' },
      { name: 'Workouts', description: 'Workout plan management' },
      { name: 'Dashboard', description: 'Progress visualization' },
      { name: 'Insights', description: 'Personalized health insights' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
