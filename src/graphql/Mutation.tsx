import { gql, useMutation } from '@apollo/client';

export const UPDATENAME = gql`
  mutation changeName($firstName: String, $lastName: String) {
    updateUserProfile(firstName: $firstName, lastName: $lastName) {
      email
    }
  }
`;

export const UPDATETIMEZONE = gql`
  mutation changeTimeZone($timezone: String) {
    updateUserProfile(timezone: $timezone) {
      email
    }
  }
`;
export const UPDATETCURRENCY = gql`
  mutation changeCurrency($currency: String) {
    updateUserProfile(currency: $currency) {
      email
    }
  }
`;

export const UPDATE_PROJECT_TIMEZONE = gql`
  mutation updateProjectTimezone($upsertProjectArgs: UpsertCashProjectInput) {
    createOrUpdateCashProject(upsertProjectArgs: $upsertProjectArgs) {
      result
    }
  }
`;
export const UPDATE_PROJECT_CURRENCY = gql`
 mutation Mutation($upsertProjectArgs: UpsertCashProjectInput) {
  createOrUpdateCashProject(upsertProjectArgs: $upsertProjectArgs) {
    result
  }
}
`;
export const UPDATEPASSWORD = gql`
  mutation changePassword($updatePasswordArgs: UpdatePasswordInput) {
    changePassword(updatePasswordArgs: $updatePasswordArgs) {
      message
    }
  }
`;
export const CREATE_CASH_ENTRY_ROW = gql`
  mutation createCashEntryRow($upsertEntryRowArgs: UpsertCashEntryRowInput) {
    createOrUpdateCashEntryRow(upsertEntryRowArgs: $upsertEntryRowArgs) {
      result
    }
  }
`;
export const CREATE_CASH_GROUP = gql`
  mutation createCashGroup($upsertGroupArgs: UpsertCashGroupInput) {
    createOrUpdateCashGroup(upsertGroupArgs: $upsertGroupArgs) {
      result
    }
  }
`;
export const DISPLAY_MODE_GROUP = gql`
  mutation displayModeGroup($upsertGroupArgs: UpsertCashGroupInput) {
    createOrUpdateCashGroup(upsertGroupArgs: $upsertGroupArgs) {
      result
    }
  }
`;
export const DELETE_CATEGORY = gql`
  mutation deleteCategory($deleteRowArgs: DeleteCashEntryRowInput) {
    deleteCashEntryRow(deleteRowArgs: $deleteRowArgs) {
      messageOfDeletion
    }
  }
`;
export const UPDATE_CATEGORY_NAME = gql`
  mutation updateCategoryName($upsertEntryRowArgs: UpsertCashEntryRowInput) {
    createOrUpdateCashEntryRow(upsertEntryRowArgs: $upsertEntryRowArgs) {
      result
    }
  }
`;
export const DISPLAY_MODE_CATEGORY = gql`
  mutation displayCategory($upsertEntryRowArgs: UpsertCashEntryRowInput) {
    createOrUpdateCashEntryRow(upsertEntryRowArgs: $upsertEntryRowArgs) {
      result
    }
  }
`;
export const ADD_TRANS_VALUE = gql`
  mutation addTransValue($upsertTransactionArgs: UpsertCashTransactionInput) {
    createOrUpdateCashEntry(upsertTransactionArgs: $upsertTransactionArgs) {
      result
    }
  }
`;
export const UPDATE_TRANS_VALUE = gql`
  mutation updateTransValue($upsertTransactionArgs: UpsertCashTransactionInput) {
    createOrUpdateCashEntry(upsertTransactionArgs: $upsertTransactionArgs) {
      result
    }
  }
`;
export const DELETE_TRANS_VALUE = gql`
  mutation deleteTransaciton(
    $deleteTransactionArgs: DeleteCashTransactionInput
  ) {
    deleteCashTransaction(deleteTransactionArgs: $deleteTransactionArgs) {
      messageOfDeletion
    }
  }
`;
export const UP_DOWN_CATEGORY = gql`
  mutation upDownCategory($upsertEntryRowArgs: UpsertCashEntryRowInput) {
    createOrUpdateCashEntryRow(upsertEntryRowArgs: $upsertEntryRowArgs) {
      result
    }
  }
`;
export const UPDATE_GROUP_NAME = gql`
  mutation updateGroupName($upsertGroupArgs: UpsertCashGroupInput) {
    createOrUpdateCashGroup(upsertGroupArgs: $upsertGroupArgs) {
      result
    }
  }
`;
export const DRAG_CATEGORY = gql`
  mutation dragCategory($listRowIds: [String]) {
    storeRankAfterDragDrop(listRowIds: $listRowIds) {
      resultOfDragDrop
    }
  }
`;
export const CHANGE_NAME_PROJECT = gql`
  mutation changeNameProject($upsertProjectArgs: UpsertCashProjectInput) {
    createOrUpdateCashProject(upsertProjectArgs: $upsertProjectArgs) {
      result
    }
  }
`;
export const CREATE_NEW_PROJECT = gql`
  mutation createNewProject($upsertProjectArgs: UpsertCashProjectInput) {
    createOrUpdateCashProject(upsertProjectArgs: $upsertProjectArgs) {
      result
    }
  }
`;
export const DELETE_CASH_GROUP = gql`
  mutation detleteCashGroup($deleteGroupArgs: DeleteCashGroupInput) {
    deleteCashGroup(deleteGroupArgs: $deleteGroupArgs) {
      messageOfDeletion
    }
  }
`;
export const INVITED = gql`
  mutation Mutation($invitationArgs: InvitationInput) {
  invite(invitationArgs: $invitationArgs) {
    id
    email
  }
}
`;
export const MUTATION_LIST_CASH_ENTRYROW = gql`
  mutation ListEntryRowsInGroup(
    $listEntryRowInGroupArgs: ListEntryRowInGroupInput
  ) {
    listEntryRowsInGroup(listEntryRowInGroupArgs: $listEntryRowInGroupArgs) {
      id
      projectId
      ownerId
      cashGroupId
      name
      rankOrder
      displayMode
    }
  }
`;
export const VERTIFY_TOKEN_RESET_PASSWORD = gql`
  mutation IsLinkResetPasswordExpired($token: String) {
  isLinkResetPasswordExpired(token: $token)
}
`;
export const MUTATION_PAYMENT = gql`
  mutation Mutation($token: String, $planId: String) {
  registerSubscription(token: $token, planId: $planId)
}
`
export const DELETE_PROJECT = gql`
  mutation deleteProject($projectId: String) {
  deleteCashProject(projectId: $projectId) {
    messageOfDeletion
  }
}
`
export const DELETE_EMAIL_SHARING = gql`
  mutation deleteEmailSharing($userIdAndProjectId: UserIdAndProjectId) {
  deleteRecord(userIdAndProjectId: $userIdAndProjectId) {
    messageOfDeletion
  }
}
`
export const SET_ROLE_EMAIL_SHARING = gql`
  mutation setRoleEmailSharing($sharingArgs: SharingInput) {
  updatePermission(sharingArgs: $sharingArgs) {
    result
  }
}
`
export const REGISTER_FREE_TRIAL = gql`
  mutation registerFreeTrial{
    startFreeTrialPlan
  }
`