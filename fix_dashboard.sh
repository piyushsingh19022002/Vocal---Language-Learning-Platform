#!/bin/bash

# Add the import
sed -i '' "6a\\
import GamificationDashboard from './gamification/GamificationDashboard';
" client/src/components/Dashboard.js

# Remove unused state variables
sed -i '' '/const \[courses, setCourses\] = useState(\[\]);/d' client/src/components/Dashboard.js
sed -i '' '/const \[expandedCourseId, setExpandedCourseId\] = useState(null);/d' client/src/components/Dashboard.js

# Fix Promise.all to single await
sed -i '' 's/const \[userData, coursesData\] = await Promise.all(\[/const userData = await getCurrentUser();/' client/src/components/Dashboard.js
sed -i '' '/getCurrentUser(),/d' client/src/components/Dashboard.js
sed -i '' '/getCourses(),/d' client/src/components/Dashboard.js
sed -i '' '/\]);/d' client/src/components/Dashboard.js
sed -i '' '/setCourses(coursesData);/d' client/src/components/Dashboard.js

# Remove practiceTime
sed -i '' '/const practiceTime = user?.practiceTime || 0;/d' client/src/components/Dashboard.js

# Add gamification dashboard after feature cards (line ~237)
sed -i '' '237a\\
\\
        {/* Gamification Dashboard */}\\
        <GamificationDashboard onViewReport={() => alert('"'"'Detailed report coming soon!'"'"')} />
' client/src/components/Dashboard.js

# Remove old activity and courses sections (lines 240-334)
sed -i '' '240,334d' client/src/components/Dashboard.js

echo "Dashboard.js updated!"
