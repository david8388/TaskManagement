class FriendList {
  friends = [];

  addFriend(name) {
    this.friends.push(name);
    this.announceFriend(name);
  }

  announceFriend(name) {
    console.log(`${name} is now a friend`);
  }

  removeFriend(name) {
    const idx = this.friends.indexOf(name);
    if (idx === -1) {
      throw new Error('Friend not found');
    }
    this.friends.splice(idx, 1);
  }
}

describe('FriendList', () => {
  let friendList;

  beforeEach(() => {
    friendList = new FriendList();
  });

  it('init Friend List', () => {
    expect(friendList.friends.length).toEqual(0);
  });

  it('adds a friend to the list', () => {
    friendList.addFriend('David');
    expect(friendList.friends.length).toEqual(1);
  });

  it('announces friendship', () => {
    friendList.announceFriend = jest.fn();
    expect(friendList.announceFriend).not.toHaveBeenCalled();
    friendList.addFriend('David');
    expect(friendList.announceFriend).toHaveBeenCalledWith('David');
  });

  describe('remove friend', () => {
    it('removes a friend from the list', () => {
      friendList.addFriend('David');
      expect(friendList.friends[0]).toEqual('David');
      friendList.removeFriend('David');
      expect(friendList.friends[0]).toBeUndefined();
    });

    it('throws an error as friend does not exists', () => {
      expect(() => friendList.removeFriend('David')).toThrow(
        new Error('Friend not found'),
      );
    });
  });
});
