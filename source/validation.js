"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var messageFormatters = {
    required: function (error) {
        var property = error.params.missingProperty;
        var path = error.dataPath
            ? [error.dataPath, property].join('.')
            : property;
        return 'Missing property ' + path;
    },
    type: function (error) {
        var path = error.dataPath.substr(1);
        return 'Property ' + path + ' should be a ' + error.params.type;
    },
    additionalProperties: function (error) {
        return 'Unexpected property: ' + error.params.additionalProperty;
    }
};
function formatErrorMessage(error) {
    var formatter = messageFormatters[error.keyword];
    return formatter
        ? formatter(error)
        : error.message;
}
function validate(validator, data, ajv) {
    if (!validator(data)) {
        var errors = validator.errors.map(formatErrorMessage);
        // It seems like ajv should be returning multiple errors but it's only returning the first error.
        // throw new Bad_Request(errors[0], {errors: errors})
        throw new errors_1.Bad_Request(errors[0]);
    }
}
exports.validate = validate;
//# sourceMappingURL=validation.js.map