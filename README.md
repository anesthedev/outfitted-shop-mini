# Outfitted - Shop Mini Foundation

A Shopify Shop Mini application built during Hackdays 2025 as a foundation for outfit and fashion-related shopping experiences.

## What is this project?

Outfitted is a Shop Mini - a lightweight application that runs natively within the Shopify mobile app. Currently, this project serves as a foundational template that demonstrates core Shop Mini capabilities including product integration, native device features, and user interface components that could power future outfit and fashion discovery features.

## What are Shop Minis?

Shop Minis are lightweight applications that run within Shopify's mobile app ecosystem. They provide merchants and developers with a way to create custom shopping experiences that feel native to the Shop app while leveraging Shopify's commerce infrastructure.

## Current Implementation

This project currently includes:

### Core Features
- **Product Display**: Integration with Shopify's product search API
- **Native Camera Access**: Ability to capture photos using device camera
- **Gallery Integration**: Access to device photo gallery for image selection
- **Touch Interactions**: Product cards with navigation and selection capabilities
- **Form Components**: Text inputs and radio button selections for user preferences

### Technical Architecture
- Built using Shopify Shop Minis SDK
- React Native-based navigation and components
- TypeScript implementation for type safety
- Supports full-bleed viewing and standalone operation

### Current Screens
1. **Home Screen**: Demonstrates product cards, user inputs, and basic interactions
2. **Native Features Screen**: Showcases camera access, gallery integration, and device API usage

## Potential Applications

While currently a template, this foundation could support various fashion and outfit-related use cases:

- Outfit photo capture and organization
- Product recommendation based on user preferences
- Style preference collection through interactive forms
- Integration with fashion product catalogs
- Visual shopping experiences

## Technical Specifications

### Dependencies
- **Shopify Shop Minis SDK**: Core framework for Shop Mini development
- **React Navigation**: Screen navigation and routing
- **TypeScript**: Type-safe development environment

### Permissions
- Camera access for photo capture
- Gallery access for image selection
- Standalone operation within Shop app

### Development Environment
- Node.js with npm package management
- Shop Minis CLI for development and testing
- Jest for testing framework
- ESLint for code quality

## Development Setup

### Prerequisites
- Node.js (LTS version recommended)
- Shop Minis CLI installed globally
- Access to Shopify Partner Dashboard for Mini registration

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

### Development Workflow
1. Use `shop-minis dev` for local development and testing
2. Test on actual devices for native feature validation
3. Deploy through Shopify Partner Dashboard when ready

## Project Structure

```
src/
├── App.tsx                 # Main application component and navigation
├── index.tsx              # Application entry point
├── manifest.json          # Shop Mini configuration and permissions
├── screens/
│   ├── HomeScreen.tsx     # Main screen with product display and interactions
│   └── NativeFeaturesScreen.tsx  # Native capabilities demonstration
└── types/
    └── screens.ts         # Navigation type definitions
```

## Hackdays Context

This project was initiated during Shopify's Hackdays 2025 (May 27-30) in Toronto. Hackdays is Shopify's internal innovation event where teams across all disciplines collaborate to prototype new ideas and explore creative solutions to merchant and customer challenges.

The event emphasizes:
- Rapid prototyping and experimentation
- Cross-functional team collaboration
- Learning new technologies and approaches
- Building solutions that could benefit Shopify's merchant ecosystem

## Next Steps

This foundation provides the groundwork for expanding into more specialized fashion and outfit functionality:

1. **Enhanced Product Integration**: Implement clothing-specific product filtering and categorization
2. **Visual Recognition**: Leverage camera capabilities for outfit analysis and matching
3. **User Preference Learning**: Expand form interactions to build style profiles
4. **Social Features**: Enable outfit sharing and recommendation systems
5. **Merchant Integration**: Create tools for fashion retailers to showcase their products

## Technical Considerations

### Performance
- Optimized for mobile-first experience within Shop app
- Lightweight bundle size for fast loading
- Efficient navigation and state management

### Scalability
- Modular component architecture for feature expansion
- TypeScript foundation for maintainable code growth
- Standard React Native patterns for team collaboration

### Integration
- Native Shop app integration for seamless user experience
- Shopify API compatibility for merchant data access
- Cross-platform support for iOS and Android devices

## Team

Built during Hackdays 2025 at Shopify Toronto Summit by :
- Anes
- Omar
- Manef
- Ilyes

## Documentation

- [Shop Minis Documentation](https://shop.app/minis)
- [Shopify Partner Developer Portal](https://partners.shopify.com)
- [Hackdays Internal Resources](https://vault.shopify.com/hackdays)