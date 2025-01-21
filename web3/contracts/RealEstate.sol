// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract RealEstateContract {

    // --------------------------------------------------- State Variables -----------------------------------------------------------------------------

    uint private totalProperties;

    // --------------------------------------------------- Structure - Property ------------------------------------------------------------------------

    struct Property {
        uint propertyId;
        uint price;
        address owner;
        string title;
        string description;
        string category;
        string propertyAddress;
        string images;
        bool isListed;
    }

    // ---------------------------------------------------- Structure - Review --------------------------------------------------------------------------

    struct Review {
        uint propertyId;
        uint rating;
        address reviewer;
        string comment;
    }

    // ---------------------------------------------------- Mapping - Property --------------------------------------------------------------------------

    mapping(uint => Property) private properties;

    // ---------------------------------------------------- Mapping - Review ----------------------------------------------------------------------------

    mapping(uint => Review[]) private reviews;

    // ---------------------------------------------------- Events - Property ---------------------------------------------------------------------------

    event PropertyRegistered(uint indexed id, address indexed owner);
    event PropertyListed(uint indexed id, address indexed owner, uint price);
    event PropertySold(uint indexed id, address indexed buyer, address indexed seller, uint price);

    // ----------------------------------------------------------- Events - Review ----------------------------------------------------------------------

    event ReviewAdded(uint indexed propertyId, address indexed reviewer, uint rating, string comment);

    // ----------------------------------------------------------- Errors -------------------------------------------------------------------------------

    error UnauthorizedUserCannotListProperty();
    error BuyerCannotBeTheSameAsThePropertyOwner();
    error SentEthIsLessThanRequiredAmount();
    error RatingMustBeGreaterThanOneAndLesserThanFive();
    error PropertyIsNotUpForSale();


    // ---------------------------------------------------------- Modifiers ------------------------------------------------------------------------------
    
    modifier onlyPropertyOwner(uint _propertyId) {
        if(properties[_propertyId].owner != msg.sender){
            revert UnauthorizedUserCannotListProperty();
        }
        _;
    }

    modifier onlyValidBuyer(uint _propertyId) {
        if(properties[_propertyId].owner == msg.sender){
            revert BuyerCannotBeTheSameAsThePropertyOwner();
        }
        _;
    }

    modifier onlyIfPropertyListed(uint _propertyId) {
        if(!properties[_propertyId].isListed){
            revert PropertyIsNotUpForSale();
        }
        _;
    }

    modifier onlyValidPayment(uint _propertyId) {
        if(msg.value < properties[_propertyId].price) {
            revert SentEthIsLessThanRequiredAmount();
        }
        _;
    }

    modifier onlyValidRating(uint _rating) {
        if(_rating < 1 && _rating > 5) {
            revert RatingMustBeGreaterThanOneAndLesserThanFive();
        }
        _;
    }

    // ---------------------------------------------------------------Functions - Property --------------------------------------------------------------------------------------------

    function registerProperty(string memory _title, string memory _description, string memory _category, string memory _propertyAddress, string memory _images, uint _price) external {
        ++totalProperties;

        properties[totalProperties] = Property(totalProperties, _price, msg.sender, _title, _description, _category, _propertyAddress, _images, false);
    
        emit PropertyRegistered(totalProperties, msg.sender);
    }

    function listProperty(uint _propertyId, uint _price) onlyPropertyOwner(_propertyId) external {
        Property storage property = properties[_propertyId];
        property.isListed = true;

        if(_price > 0) {
            property.price = _price;
        }

        emit PropertyListed(_propertyId, msg.sender, property.price);
    }

    function buyProperty(uint _propertyId) onlyValidBuyer(_propertyId) onlyValidPayment(_propertyId) onlyIfPropertyListed(_propertyId) external payable {
        uint amount = msg.value;

        Property storage property = properties[_propertyId];
        address seller = property.owner;

        (bool sent, ) = payable(property.owner).call{value: amount}("");

        if(sent) {
            property.owner = msg.sender;
            property.isListed = false;
            property.price = msg.value;
            emit PropertySold(_propertyId, property.owner, seller, property.price);
        }
    }

    function updateProperty(uint _propertyId, string memory _title, string memory _description, string memory _category, string memory _images) onlyPropertyOwner(_propertyId) external {
        Property storage property = properties[_propertyId];
        
        if (bytes(_title).length > 0) {
            property.title = _title;
        }

        if (bytes(_description).length > 0) {
            property.description = _description;
        }

        if (bytes(_category).length > 0) {
            property.category = _category;
        }

        if (bytes(_images).length > 0) {
            property.images = _images;
        }
    }

    function getProperty(uint _propertyId) external view returns(Property memory) {
        return properties[_propertyId];
    }

    function getUserProperties(address user) external view returns(Property[] memory) {
        uint itemCount = 0;

        for (uint i = 1; i <= totalProperties; i++) {
            if (properties[i].owner == user) {
                itemCount++;
            }
        }

        Property[] memory _properties = new Property[](itemCount);
        uint currentIndex = 0;

        for (uint i = 1; i <= totalProperties; i++) {
            if (properties[i].owner == user) {
                _properties[currentIndex] = properties[i];
                currentIndex++;
            }
        }

        return _properties;
    }


    function getTotalProperties() external view returns(uint) {
        return totalProperties;
    }

    function checkIfPropertyIsListed(uint _propertyId) external view returns(bool isLised) {
        return properties[_propertyId].isListed;
    }

    // ------------------------------------------ Functions - Review ---------------------------------------------------------------

    function addReview(uint _propertyId, uint _rating, string calldata _comment) onlyValidRating(_rating) external {
        reviews[_propertyId].push(Review(_propertyId, _rating, msg.sender, _comment));
        
        emit ReviewAdded(_propertyId, msg.sender, _rating, _comment);
    }

    function getUserReviews(address user) external view returns(Review[] memory) {
        uint itemCounter;

        for(uint i = 1; i <= totalProperties; i++){
            for (uint j=0; j < reviews[i].length; j++){
                if(reviews[i][j].reviewer == user){
                    itemCounter++;
                }
            }
        }

        Review[] memory userReviews = new Review[](itemCounter);
        uint currentIndex = 0;

        for(uint i = 1; i <= totalProperties; i++) {
            for(uint j = 0; j < reviews[i].length; j++) {
                if(reviews[i][j].reviewer == user){
                    userReviews[currentIndex] = reviews[i][j];
                    currentIndex++;
                }
            }
        }

        return userReviews;
    }

    function getPropertyReviews(uint _propertyId) external view returns(Review[] memory) {
        return reviews[_propertyId];
    }

    function getTotalReviewsForProperty(uint _propertyId) external view returns(uint avgRating) {
        uint ratings = 0;
        uint totalReviews = reviews[_propertyId].length;

        for (uint i = 0; i < totalReviews; i++){
            ratings += reviews[_propertyId][i].rating;
        }

        avgRating = ratings / totalReviews;
    }

}