<div align="end">
  Langeage : <a href="https://namjongtae.github.io/github-traffic-viewer">English</a> | 한국어
</div>

# GitHub Traffic Viewer

## 소개
GitHub API를 활용하여 저장소의 트래픽 통계를 가져오고 표시하는 Chrome 확장 프로그램입니다. 이 프로그램은 **조회수**와 **고유 방문자 수**에 대한 유용한 통찰을 제공합니다.

GitHub의 트래픽 데이터는 **2주간만 보존**되기 때문에, 이 확장 프로그램은 **데이터 손실을 방지하고 과거 통계를 안전하게 저장**합니다. 이를 통해 장기적인 트렌드를 분석하고 저장소 성능에 대한 더 깊은 통찰을 얻을 수 있습니다.

## 기능
- Github traffic data를 조회하여 **views, unique_visitors** 데이터를 출력합니다.
- **테이블, 차트** 형식으로 데이터를 출력 할 수 있습니다.
- 조회한 데이터를 **날짜 형식**으로 필터링 가능하며, **오래된순, 최신순, views순, unique_visitors순**으로 정렬할 수 있습니다.
- 조회한 데이터를 **JSON, EXCEL, TXT** 형식으로 다운로드할 수 있습니다.
- 가져온 데이터를 저장하여 **데이터 손실을 방지**합니다.
- **최대 10개의 레포지토리** 데이터를 저장할 수 있습니다.
- 저장된 데이터는 **최대 2년간** 유지되며 이후 자동 삭제됩니다.

## 중요한 참고 사항
**🚨 확장 프로그램을 삭제하면 모든 저장된 데이터가 삭제됩니다!**

## 설치
Chrome 웹 스토어에서 [GitHub Traffic Viewer](https://chromewebstore.google.com/detail/github-traffic-viewer/mncijnlfljjhdgmabakgdjofiakliaca)를 다운로드할 수 있습니다.

## 사용 방법
### 새 트래픽 데이터 가져오기
1. 확장 프로그램 설치 후, **Get New Traffic Data** 메뉴를 클릭하세요.
2. GitHub 사용자 이름, 액세스 토큰, 분석하려는 저장소 이름을 입력한 뒤 **Get Traffic Data** 버튼을 클릭합니다.
3. 데이터가 로드되면 지정된 저장소의 트래픽 통계가 표시됩니다.

### 저장된 트래픽 데이터 불러오기
1. **Load To Stored Traffic Data** 메뉴를 클릭하세요.
2. 확인하려는 저장소를 선택한 뒤 **Load Stored Traffic Data** 버튼을 클릭합니다.
3. 로드가 완료되면 선택한 저장소의 저장된 트래픽 데이터가 표시됩니다.

### 저장된 트래픽 데이터 삭제하기
1. **Delete Stored Traffic Data** 메뉴를 클릭하세요.
2. 삭제하려는 저장소를 선택한 뒤 **Delete Stored Traffic Data** 버튼을 클릭합니다.
3. 데이터 삭제가 완료되면 확인 메시지가 표시됩니다.

## GitHub Personal Access Token 생성 방법

이 확장 프로그램을 사용하려면 GitHub Personal Access Token이 필요합니다. 아래 단계에 따라 토큰을 생성하세요:

### 1. **GitHub에 로그인하기**
   - [GitHub](https://github.com)에 방문하여 GitHub 계정으로 로그인합니다.

### 2. **설정 페이지로 이동하기**
   - 화면 오른쪽 상단의 프로필 사진을 클릭한 뒤, 드롭다운 메뉴에서 **Settings(설정)** 을 선택합니다.

### 3. **개발자 설정 접근하기**
   - 왼쪽 메뉴를 아래로 스크롤한 후 **Developer settings(개발자 설정)** 을 클릭합니다.

### 4. **새로운 토큰 생성하기**
   - **Personal access tokens(개인 액세스 토큰)** 아래의 **Tokens (classic)** 을 선택한 뒤, **Generate new token(새 토큰 생성)** 버튼을 클릭합니다.

### 5. **토큰 설정하기**
   - 토큰을 식별할 수 있도록 메모를 입력합니다. (예: "GitHub Traffic Viewer")
   - 토큰의 만료 날짜를 설정하거나, **No expiration(만료 없음)** 을 선택하여 제한 없이 사용할 수 있도록 설정합니다. (⚠️ 이 옵션은 신중히 사용하세요.)
   - **권한(Scopes)** 항목에서 다음 권한을 선택합니다:
     - **repo**: 개인 저장소에 대한 전체 액세스 권한 (개인 저장소 데이터를 보려면 필요).
     - **read:org**: 조직 수준의 트래픽 통계를 읽기 위한 권한 (필요한 경우).

### 6. **토큰 생성 및 저장하기**
   - **Generate token(토큰 생성)** 버튼을 클릭합니다.
   - 생성된 토큰을 복사하고 안전한 곳에 저장하세요. 페이지를 떠난 후에는 다시 확인할 수 없습니다.

> ⚠️ **주의사항**: 액세스 토큰을 비공개로 유지하고 다른 사람과 공유하지 마세요. 토큰이 유출된 경우, 즉시 GitHub의 개발자 설정에서 토큰을 취소하고 새 토큰을 생성하세요.

## 개인정보처리방침
전체 [개인정보처리방침](https://namjongtae.github.io/github-traffic-viewer/privacy_policy_KR)은 Privacy Policy 페이지에서 확인할 수 있습니다.
