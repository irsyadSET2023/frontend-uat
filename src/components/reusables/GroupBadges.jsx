import React from "react";
import { Badge } from "../ui/badge";

const GroupBadges = ({ array = [], maxLength = 3 }) => {
  return array.map((testCase, index, arr) => {
    if (index > maxLength) {
      return null;
    } else if (index > maxLength - 1) {
      return (
        <Badge key={index} variant="outline">
          +{arr.length - maxLength}
        </Badge>
      );
    }
    return (
      <Badge key={index} variant="outline">
        {Object.values(testCase)[0]}
      </Badge>
    );
  });
};

export default GroupBadges;
