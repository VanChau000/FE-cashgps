import { gql } from '@apollo/client';

export const GETCASH = gql`
  query listProjects {
    listProjects {
      id
      ownerId
      name
      startingBalance
      timezone
      currency
      initialCashFlow
      startDate
      weekSchedule
    }
  }
`;

export const GET_CUURENCY_SYMBOL = gql`
   query FetchProject {
    fetchProject {
      infoProject {
        currencySymbol
      }
    }}
`
export const GETSINGLEPROJECT = gql`
  query FetchProject($projectId: String) {
  fetchProject(projectId: $projectId) {
    ownerActiveSubscription
        ownerSubscriptionExpiresAt
    cashGroup {
      cashEntryRow {
        cashGroupId
        displayMode
        id
        name
        ownerId
        projectId
        rankOrder
        transactions {
          transactionDate
          transactions {
            cashEntryRowId
            cashGroupId
            description
            displayMode
            estimatedValue
            frequency
            frequencyStopAt
            id
            ownerId
            projectId
            transactionDate
            value
            parentId
          }
        }
      }
      displayMode
      groupType
      id
      name
      rankOrder
    }
    infoProject {
      currency
      currencySymbol
      initialCashFlow
      projectName
      startDate
      startingBalance
      timezone
      weekSchedule
    }
    permission
  }
}

`

export const GETUSERINFOR = gql`
  query GetUser {
    getUser {
      hasProject
      user {
        id
        email
        googleId
        lastName
        firstName
        timezone
        currency
        isEmailVerified
        activeSubscription
        subscriptionExpiresAt
        customerId
      }
    }
  }
`;

export const LIST_CATEGORY = gql`
  query listCategory($listEntryRowInGroupArgs: ListEntryRowInGroupInput) {
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
export const PAGE_VIEWER = gql`
  query pageViewer($watchProjectArgs: WatchProjectInput) {
    watchProject(watchProjectArgs: $watchProjectArgs) {
      fetchProject {
        
        infoProject {
          projectName
          startingBalance
          timezone
          currency
          initialCashFlow
          startDate
          weekSchedule
        }
        cashGroup {
          id
          name
          groupType
          rankOrder
          displayMode
          cashEntryRow {
            id
            projectId
            ownerId
            cashGroupId
            name
            rankOrder
            displayMode
            transactions {
              transactionDate
              transactions {
                id
                cashEntryRowId
                cashGroupId
                projectId
                ownerId
                displayMode
                transactionDate
                description
                estimatedValue
                value
                frequency
                frequencyStopAt
              }
            }
          }
        }
      }
      permission
    }
  }
`;
export const GET_LIST_NAME_CATEGORY = gql`
  query listNameCategory($listEntryRowInGroupArgs: ListEntryRowInGroupInput) {
    listEntryRowsInGroup(listEntryRowInGroupArgs: $listEntryRowInGroupArgs) {
      name
      projectId
      ownerId
      cashGroupId
      name
      rankOrder
      displayMode
    }
  }
`;
export const GET_LIST_NAME_GROUP = gql`
  query getListNameGroup {
    listGroups {
      filteredGroups {
        in {
          id
          name
        }
        out {
          id
          name
        }
      }
    }
  }
`;
export const GET_CASH_GROUP_BY_TYPE = gql`
  query getTypeCashGroup($groupType: String) {
    listGroupsByType(groupType: $groupType) {
      groupsByType {
        name
      }
    }
  }
`;
export const GET_LIST_PROJECT = gql`
  query listProject {
  listProjects {
    ownerActiveSubscription
    ownerSubscriptionExpiresAt
    projects {
      id
      ownerId
      name
      startingBalance
      timezone
      currency
      initialCashFlow
      startDate
      weekSchedule
      ownerEmail
      ownerLastName
      ownerFirstName
      sharedWith {
        userId
        lastName
        firstName
        email
        permission
      }
    }
    sharingProjects {
      id
      ownerId
      name
      startingBalance
      timezone
      currency
      initialCashFlow
      startDate
      weekSchedule
      permission
      ownerEmail
      ownerLastName
      ownerFirstName
    }
  }
}
`
export const GET_LIST_SHARE_USER = gql`
  query getListShareUser($projectId: String) {
  listInfoOfAuthorizedUsersWithProject(projectId: $projectId) {
    userId
    lastName
    firstName
    email
    permission
  }
}
`

export const GET_SUBSCRIPTION_PROJECT = gql`
  query getSubscriptionProject {
    getUser {
      user {
        id
        email
        googleId
        customerId
        lastName
        firstName
        timezone
        currency
        isEmailVerified
        activeSubscription
        subscriptionExpiresAt
      }
      hasProject
    }
  }
`

export const REGISTER_TRIAL_SUBSCRIPTION_PROJECT = gql`
  query Query {
    startFreeTrialPlan
  }
`