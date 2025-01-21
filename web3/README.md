# RealEstateContract

This is a smart contract for managing real estate properties on the Ethereum blockchain. It allows users to register, list, buy properties, update property details, and leave reviews. This contract includes features for managing ownership, listings, and reviews in a decentralized manner. It ensures only authorized users can perform specific actions and allows for secure transactions.

## Table of Contents
- [Features](#features)
- [Deployment Instructions](#deployment-instructions)
- [Contract Functions](#contract-functions)
- [State Variables](#state-variables)
- [Modifiers](#modifiers)
- [Events](#events)
- [Errors](#errors)

## Features

- **Property Registration**: Users can register properties with details such as title, description, category, address, and price.
- **Listing Properties for Sale**: Property owners can list their properties for sale with a specified price.
- **Buying Properties**: Buyers can purchase listed properties by sending the required amount of Ether to the seller.
- **Property Updates**: Property owners can update details of their properties such as title, description, category, and images.
- **Reviewing Properties**: Users can leave reviews for properties, providing a rating and comment.
- **Property Information**: Users can fetch property details, user-specific properties, and review information for properties.

## Deployment Instructions

1. Deploy the contract using your preferred Ethereum development environment (e.g., Hardhat, Truffle, Remix).
2. After deployment, interact with the contract via Web3.js or Ethers.js in your frontend or backend application.

### Example Deployment (using Remix):
- Open Remix (https://remix.ethereum.org).
- Paste the contract code in a new Solidity file.
- Compile the contract.
- Deploy the contract to the Ethereum testnet or mainnet.

## Contract Functions

### 1. **registerProperty**
- **Description**: Registers a new property with details like title, description, category, property address, images, and price.
- **Parameters**: 
  - `_title`: The title of the property.
  - `_description`: Description of the property.
  - `_category`: The category of the property (e.g., residential, commercial).
  - `_propertyAddress`: The address of the property.
  - `_images`: Links to images of the property.
  - `_price`: The price of the property.

### 2. **listProperty**
- **Description**: Lists a property for sale with a price.
- **Parameters**:
  - `_propertyId`: The ID of the property to list.
  - `_price`: The sale price of the property.

### 3. **buyProperty**
- **Description**: Allows a buyer to purchase a listed property by sending Ether to the owner.
- **Parameters**:
  - `_propertyId`: The ID of the property to buy.

### 4. **updateProperty**
- **Description**: Allows the property owner to update property details.
- **Parameters**:
  - `_propertyId`: The ID of the property to update.
  - `_title`: The new title of the property.
  - `_description`: The new description of the property.
  - `_category`: The new category of the property.
  - `_images`: New images for the property.

### 5. **getProperty**
- **Description**: Fetches the details of a property by its ID.
- **Parameters**:
  - `_propertyId`: The ID of the property to fetch.
  
### 6. **getUserProperties**
- **Description**: Fetches all properties owned by a particular user.
- **Parameters**:
  - `user`: The address of the user whose properties to fetch.
  
### 7. **getTotalProperties**
- **Description**: Returns the total number of properties in the contract.

### 8. **checkIfPropertyIsListed**
- **Description**: Checks if a property is listed for sale.
- **Parameters**:
  - `_propertyId`: The ID of the property.

### 9. **addReview**
- **Description**: Adds a review for a property with a rating and comment.
- **Parameters**:
  - `_propertyId`: The ID of the property to review.
  - `_rating`: The rating given to the property (between 1 and 5).
  - `_comment`: The review comment.

### 10. **getUserReviews**
- **Description**: Fetches all reviews left by a specific user.
- **Parameters**:
  - `user`: The address of the user whose reviews to fetch.

### 11. **getPropertyReviews**
- **Description**: Fetches all reviews for a specific property.
- **Parameters**:
  - `_propertyId`: The ID of the property to fetch reviews for.

### 12. **getTotalReviewsForProperty**
- **Description**: Returns the average rating for a property based on all reviews.
- **Parameters**:
  - `_propertyId`: The ID of the property.

## State Variables

- `totalProperties`: Tracks the total number of properties in the contract.
- `properties`: A mapping that stores property details by their unique property ID.
- `reviews`: A mapping that stores reviews for properties by property ID.

## Modifiers

- **onlyPropertyOwner**: Restricts actions to the property owner (e.g., listing or updating a property).
- **onlyValidBuyer**: Ensures the buyer is not the same as the property owner.
- **onlyIfPropertyListed**: Ensures the property is listed for sale before purchasing.
- **onlyValidPayment**: Ensures the sent Ether is equal to or greater than the property's listed price.
- **onlyValidRating**: Ensures the rating provided is between 1 and 5.

## Events

- **PropertyRegistered**: Emitted when a new property is registered.
- **PropertyListed**: Emitted when a property is listed for sale.
- **PropertySold**: Emitted when a property is sold.
- **ReviewAdded**: Emitted when a review is added for a property.

## Errors

- **UnauthorizedUserCannotListProperty**: Reverts if a non-owner tries to list a property.
- **BuyerCannotBeTheSameAsThePropertyOwner**: Reverts if the buyer is the same as the property owner.
- **SentEthIsLessThanRequiredAmount**: Reverts if the sent Ether is less than the required amount.
- **RatingMustBeGreaterThanOneAndLesserThanFive**: Reverts if the rating is not between 1 and 5.
- **PropertyIsNotUpForSale**: Reverts if the property is not listed for sale.

## Conclusion

This smart contract provides an end-to-end solution for managing real estate transactions on the blockchain. It allows users to register, list, buy, update, and review properties securely while ensuring that the process is efficient and transparent.