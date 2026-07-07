# Qiyam App Documentation

## Majlis Alert Feature

---

## 1. Project Overview

**Qiyam App** is a general-use mobile application built with **React Native**.
The application contains multiple sections/features on the Home Screen. One of the main assigned features is **Majlis Alert**.

The goal of the **Majlis Alert** feature is to help users find nearby majalis based on:

- Current location
- Selected category
- Selected filter
- Selected distance range

---

## 2. Assigned Feature

### Feature Name

**Majlis Alert**

### Main Purpose

The Majlis Alert feature allows users to:

- View majalis near their current location
- Select a majlis category
- Apply filters such as upcoming soonest first
- Adjust distance using a distance slider
- Submit selected options
- View majlis cards in a scrollable list
- Open a detailed screen for each majlis

---

## 3. Application Flow

The basic application flow is:

```txt
Splash Screen
   ↓
Home Screen
   ↓
Majlis Alert Screen
   ↓
Majlis Cards List
   ↓
Majlis Detail Screen
```

---

## 4. Screen Flow

### 4.1 Splash Screen

The Splash Screen is shown when the app starts.

**Purpose:**

- Show the app logo
- Give the app a professional startup feel
- Navigate the user to the Home Screen after loading

**Flow:**

```txt
App opens
   ↓
Logo shown
   ↓
Home Screen opens
```

---

### 4.2 Home Screen

The Home Screen contains multiple bars/options for different app features.

One of these bars is:

```txt
Majlis Alert
```

When the user clicks on the Majlis Alert bar, the app navigates to the Majlis Alert screen.

**Flow:**

```txt
Home Screen
   ↓
User clicks Majlis Alert
   ↓
Majlis Alert Screen opens
```

---

### 4.3 Majlis Alert Screen

This is the main screen for the assigned feature.

This screen contains:

- Category dropdown
- Filter dropdown
- Distance slider
- Submit button
- Majlis cards list after submit
- Back button

Before submitting, the user can select the required options.

After clicking the **Submit** button:

- A loading icon is shown
- Majlis data is fetched from Appwrite
- Majlis list is displayed on the same screen
- The filters remain visible at the top
- Majlis cards are shown below in a scrollable list

**Flow:**

```txt
Majlis Alert Screen
   ↓
User selects category/filter/distance
   ↓
User clicks Submit
   ↓
Loading icon shown
   ↓
Majlis cards shown
```

---

### 4.4 Majlis Detail Screen

When the user clicks on a majlis card, the detail screen opens.

The detail screen shows complete information about one selected majlis.

Details may include:

- Majlis name
- Category
- Time
- Date
- Location
- Address
- Distance
- Description, if available

This screen also contains a back button so the user can return to the Majlis Alert screen.

**Flow:**

```txt
User clicks Majlis Card
   ↓
Majlis Detail Screen opens
   ↓
User views full details
   ↓
Back button returns to Majlis Alert Screen
```

---

## 5. Default Options

When the Majlis Alert screen opens, some options should already be selected by default.

### Default Category

```txt
All
```

This means all types of majalis will be shown unless the user selects a specific category.

### Default Filter

```txt
Upcoming soonest first
```

This means the nearest upcoming majlis by time should appear first.

### Default Distance

```txt
5 to 6 km
```

The distance slider should start around **5 to 6 km** by default.

---

## 6. Categories

The category dropdown may include:

- All
- Daras
- Ladies Majlis
- Niaz Place
- Jaloos
- Gents Majlis

**Purpose of category filter:**

To show only the majalis that match the selected category.

**Example:**

If the user selects:

```txt
Ladies Majlis
```

Then only ladies majalis should appear in the card list.

---

## 7. Filters

The filter dropdown may include sorting/filtering options such as:

- Upcoming soonest first
- Oldest first
- Nearest distance first

The default filter should be:

```txt
Upcoming soonest first
```

**Purpose of filter:**

To control the order in which majalis are shown.

---

## 8. Distance Slider

The distance option should be shown as a slider.

**Purpose:**

To allow the user to increase or decrease the search radius.

**Example values:**

- 5 km
- 10 km
- 15 km
- 20 km

If the user selects **5 km**, only majalis within 5 km of the user’s current location should be shown.

---

## 9. Location Access

The Majlis Alert feature needs user location access.

**Purpose:**

To find majalis near the user's current location.

**Required location values:**

- User latitude
- User longitude

These values are used to calculate the distance between the user and each majlis.

**Location flow:**

```txt
Ask location permission
   ↓
Get current location
   ↓
Use latitude and longitude
   ↓
Calculate nearby majalis
```

**Important states to handle:**

- Location loading
- Location allowed
- Location denied
- Location error

If location permission is denied, the app should show a user-friendly message.

---

## 10. Database

The project will use **Appwrite** as the database.

Appwrite will store majlis data such as:

- Majlis name
- Category
- Date
- Time
- Location name
- Address
- Latitude
- Longitude
- Description

The app will fetch data from Appwrite and then apply:

- Category filtering
- Distance filtering
- Time sorting
- Card rendering

---

## 11. Majlis Card

Each majlis should be shown in card form.

A card may show:

- Majlis name
- Category
- Time
- Location
- Distance

**Purpose of card:**

To give the user a quick summary of one majlis.

When the user clicks on a card:

```txt
Majlis Detail Screen opens
```

---

## 12. Suggested Folder Structure

The exact structure depends on the existing project, but the feature can be organized like this:

```txt
app/
  _layout.tsx
  index.tsx
  majlis-alert/
    index.tsx
    [id].tsx

components/
  majlis/
    MajlisCard.tsx
    CategoryDropdown.tsx
    FilterDropdown.tsx
    DistanceSlider.tsx
    LoadingState.tsx
    EmptyState.tsx

services/
  appwrite.ts
  majlisService.ts

types/
  majlis.ts

utils/
  distance.ts
  sortMajlis.ts
  filterMajlis.ts

hooks/
  useCurrentLocation.ts
  useMajlis.ts
```

---

## 13. File Responsibilities

### `app/index.tsx`

Home Screen.

**Purpose:**

Show multiple app feature bars including Majlis Alert.

---

### `app/majlis-alert/index.tsx`

Main Majlis Alert screen.

**Purpose:**

Show filters, distance slider, submit button, loading state, and majlis cards list.

---

### `app/majlis-alert/[id].tsx`

Majlis Detail screen.

**Purpose:**

Show full details of the selected majlis.

---

### `components/majlis/MajlisCard.tsx`

Reusable card component.

**Purpose:**

Show one majlis item in card form.

---

### `components/majlis/CategoryDropdown.tsx`

Reusable category dropdown.

**Purpose:**

Allow user to select category.

---

### `components/majlis/FilterDropdown.tsx`

Reusable filter dropdown.

**Purpose:**

Allow user to select sorting/filtering option.

---

### `components/majlis/DistanceSlider.tsx`

Reusable distance slider.

**Purpose:**

Allow user to select radius distance.

---

### `services/majlisService.ts`

Appwrite data fetching logic.

**Purpose:**

Fetch majlis data from Appwrite.

---

### `types/majlis.ts`

TypeScript type definitions.

**Purpose:**

Define the shape of majlis data.

**Example data shape:**

- id
- name
- category
- date
- time
- location
- address
- latitude
- longitude
- description

---

### `utils/distance.ts`

Distance calculation helper.

**Purpose:**

Calculate distance between user location and majlis location.

---

### `utils/filterMajlis.ts`

Filtering helper.

**Purpose:**

Filter majalis by category and distance.

---

### `utils/sortMajlis.ts`

Sorting helper.

**Purpose:**

Sort majalis by time or distance.

---

## 14. Suggested Development Order

The feature should be developed step by step.

### Step 1: Understand Project Structure

Before writing code, check:

- Where screens are placed
- How navigation is working
- How components are organized
- How styling is done
- How Appwrite is configured

---

### Step 2: Create Feature Branch

Work should be done only on the feature branch.

- Main branch should not be touched directly
- Dev branch should only be pulled when needed
- Feature branch is used for development

---

### Step 3: Create Majlis Alert Screen UI

First create the screen layout only.

Include:

- Back button
- Category dropdown placeholder
- Filter dropdown placeholder
- Distance slider placeholder
- Submit button

---

### Step 4: Create Static Majlis Cards

Before connecting Appwrite, create temporary/static data and show cards.

**Purpose:**

To confirm UI and card list flow first.

---

### Step 5: Create MajlisCard Component

Move card UI into a reusable component.

**Purpose:**

To keep the screen clean and reusable.

---

### Step 6: Add Majlis Detail Screen

When the user clicks on a card, navigate to the detail screen.

**Purpose:**

To complete card-to-detail navigation flow.

---

### Step 7: Add Dropdown UI

Add category and filter dropdowns.

**Purpose:**

To let user select category and sorting option.

---

### Step 8: Add Distance Slider

Add slider for radius selection.

**Purpose:**

To allow user to control nearby search distance.

---

### Step 9: Add Appwrite Data Fetching

Connect the screen with Appwrite and fetch real majlis data.

**Purpose:**

To replace static data with database data.

---

### Step 10: Add Location Access

Ask user for location permission and get current location.

**Purpose:**

To filter majalis based on nearby distance.

---

### Step 11: Add Distance Calculation

Calculate distance between user location and each majlis location.

**Purpose:**

To know which majalis are inside selected radius.

---

### Step 12: Add Filtering and Sorting

Apply:

- Category filter
- Distance filter
- Upcoming soonest first filter
- Nearest distance first filter

---

### Step 13: Add Loading, Empty, and Error States

Handle important UI states:

- Loading while data is being fetched
- Empty state when no majlis is found
- Error state if something fails
- Location denied state if permission is not allowed

---

### Step 14: Final Cleanup

After feature works:

- Clean unused code
- Check file names
- Check component names
- Check TypeScript errors
- Check UI spacing
- Check navigation flow
- Test on device

---

## 15. Important React Native Concepts Used

This feature will help revise and understand these concepts:

- Expo Router navigation
- Dynamic routes
- Back navigation
- Components
- Props
- `useState`
- `useEffect`
- Conditional rendering
- `FlatList`
- `TouchableOpacity` / `Pressable`
- Dropdown UI
- Slider UI
- Loading state
- Error state
- Empty state
- Location permission
- API/database fetching
- Array `filter`
- Array `sort`
- TypeScript types
- NativeWind styling
- Git branch workflow

---

## 16. GitHub Workflow

The project uses three branches:

```txt
main
dev
feature
```

### Main Branch

Stable production code.

Do not push directly to main.

### Dev Branch

Development/testing branch.

Pull from dev only when needed.

### Feature Branch

Main working branch for Majlis Alert feature.

All assigned work should be done here.

### Recommended Flow

```txt
main
  ↓
dev
  ↓
feature/majlis-alert
```

Meaning:

- Create `dev` from `main`
- Create `feature/majlis-alert` from `dev`
- Work on `feature/majlis-alert`
- Push only the feature branch
- Create pull request into `dev`
- Do not touch `main` directly

---

## 17. Git Commands Flow

### Start Work

```bash
git checkout main
git pull origin main
git checkout -b dev
git push -u origin dev
git checkout -b feature/majlis-alert
git push -u origin feature/majlis-alert
```

### Daily Work

```bash
git checkout feature/majlis-alert
git status
```

### Commit Work

```bash
git add .
git commit -m "feat: add majlis alert screen"
```

### Push Feature Branch

```bash
git push origin feature/majlis-alert
```

### If Dev Has New Updates and They Are Needed

```bash
git checkout feature/majlis-alert
git fetch origin
git merge origin/dev
```

Before pulling or merging from dev, always check:

```bash
git status
```

If there is uncommitted work, commit it first.

---

## 18. Suggested Commit Messages

```txt
feat: add majlis alert screen
feat: add majlis card component
feat: add majlis detail screen
feat: add category dropdown
feat: add filter dropdown
feat: add distance slider
feat: connect majlis data with appwrite
feat: add current location access
feat: filter majlis by selected radius
feat: sort majlis by upcoming time
fix: handle empty majlis list
fix: handle location permission denied state
style: improve majlis card layout
refactor: organize majlis alert components
```

---

## 19. Beginner Working Mindset

Before coding any part, ask:

- What screen am I working on?
- What data does this screen need?
- What component can be reusable?
- What state do I need?
- What happens when the user clicks?
- What should show while loading?
- What should show if no data is found?
- Where should this logic live?
- What small commit can I make after this?

---

## 20. Summary

The Majlis Alert feature should be built slowly and step by step.

The best order is:

```txt
Understand project structure
Create feature branch
Build static UI
Create majlis cards
Create detail screen
Add dropdowns
Add distance slider
Connect Appwrite
Add location access
Calculate distance
Apply filters and sorting
Handle loading/empty/error states
Clean code
Push feature branch
Create pull request
```

The main goal is not only to complete the feature, but also to understand the real project flow, code organization, screen flow, component flow, database flow, and GitHub workflow properly.
