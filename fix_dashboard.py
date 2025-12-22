#!/usr/bin/env python3
import re

# Read the file
with open('client/src/components/Dashboard.js', 'r') as f:
    content = f.read()

# Add GamificationDashboard import after DashboardSkeleton
content = content.replace(
    "import DashboardSkeleton from './dashboard/DashboardSkeleton';",
    "import DashboardSkeleton from './dashboard/DashboardSkeleton';\nimport GamificationDashboard from './gamification/GamificationDashboard';"
)

# Remove unused state variables
content = re.sub(r'\s*const \[courses, setCourses\] = useState\(\[\]\);', '', content)
content = re.sub(r'\s*const \[expandedCourseId, setExpandedCourseId\] = useState\(null\);', '', content)

# Fix the fetchData to not call getCourses
content = re.sub(
    r'const \[userData, coursesData\] = await Promise\.all\(\[\s*getCurrentUser\(\),\s*getCourses\(\),\s*\]\);',
    'const userData = await getCurrentUser();',
    content,
    flags=re.DOTALL
)
content = content.replace('setCourses(coursesData);', '')

# Remove practiceTime variable
content = re.sub(r'\s*const practiceTime = user\?\.practiceTime \|\| 0;', '', content)

# Find and remove the old Activity Section (from comment to end of div)
activity_pattern = r'\s*{/\* Activity Section \*/}.*?</div>\s*</div>'
content = re.sub(activity_pattern, '', content, flags=re.DOTALL)

# Find and remove the Courses Section (from comment to end of div)
courses_pattern = r'\s*{/\* Courses Section \*/}.*?(?=\s*</div>\s*</div>\s*\);\s*};)'
content = re.sub(courses_pattern, '', content, flags=re.DOTALL)

# Add gamification dashboard after feature cards section
# Find the closing of feature cards section and add gamification
content = re.sub(
    r'(</div>\s*</div>\s*{/\* Activity Section \*/})',
    r'</div>\n        </div>\n\n        {/* Gamification Dashboard */}\n        <GamificationDashboard onViewReport={() => alert(\'Detailed report coming soon!\')} />',
    content
)

# Write the file
with open('client/src/components/Dashboard.js', 'w') as f:
    f.write(content)

print("Dashboard.js updated successfully!")
